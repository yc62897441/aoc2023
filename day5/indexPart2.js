// 外部引入檔案
const fs = require('fs')
const filename = './day5/input.txt'

// 定義基礎資料結構
const table = {
    'seed-to-soil map:': [],
    'soil-to-fertilizer map:': [],
    'fertilizer-to-water map:': [],
    'water-to-light map:': [],
    'light-to-temperature map:': [],
    'temperature-to-humidity map:': [],
    'humidity-to-location map:': [],
}
const arrayNames = [
    'seed-to-soil map:',
    'soil-to-fertilizer map:',
    'fertilizer-to-water map:',
    'water-to-light map:',
    'light-to-temperature map:',
    'temperature-to-humidity map:',
    'humidity-to-location map:',
]

// 主程式
main()
async function main() {
    try {
        // 讀取檔案
        const dataSplit = await readData()

        // 將檔案轉換成所需的資料結構
        // 取得各個種子
        // 取得各組 [種子, 範圍]
        const seedSets = []
        const temp = dataSplit[0].split(' ').filter((item) => item !== 'seeds:')
        temp.forEach((item, index) => {
            if (index % 2 === 0) {
                seedSets.push([item, temp[index + 1]])
            }
        })
        // 取得各個轉換的 map(每個 map 都用一個陣列存起來)
        let currentArrayName = ''
        dataSplit.forEach((item) => {
            if (table[item]) currentArrayName = item
            if (item && item !== currentArrayName) {
                table[currentArrayName]?.push(item)
            }
        })

        // 開始運算
        // 用來儲存各組種子的最終轉換結果
        const results = []
        // 處理各組種子 [種子, 範圍]，經過 n 個 map 轉換出結果
        seedSets.forEach((seedSet) => {
            let input = Number(seedSet[0])
            let range = Number(seedSet[1])

            // 把輸入轉換成輸出，依照 n 個 map 來轉換
            arrayNames.forEach((arrayName) => {
                input = transferToNewInput(arrayName, input, range)
            })

            // 把種子的最終轉換結果存起來
            results.push(input)
        })

        // 從 results 找出 lowest location number
        let result = Infinity
        results.forEach((item) => {
            if (item < result) result = item
        })

        // 印出 lowest location number
        console.log('result', result)
    } catch (error) {
        console.log(error)
    }
}

// 讀取檔案
async function readData() {
    try {
        const data = fs.readFileSync(filename, 'utf8', async function (err, data) {
            if (err) throw err
            return data
        })
        const dataSplit = data.split('\n')
        return dataSplit
    } catch (error) {
        console.log(error)
    }
}

// 把輸入轉換成輸出，依照 map 裡面的 n 筆 [目標範圍起點, 來源範圍起點, 範圍長度] 資料來轉換
function transferToNewInput(arrayName, input, range) {
    let output = Infinity

    table[arrayName].forEach((item) => {
        const itemSplit = item.split(' ')
        const outputStart = Number(itemSplit[0]) // 目標範圍起點
        const inputStart = Number(itemSplit[1]) // 來源範圍起點
        const mapRange = Number(itemSplit[2]) // map 範圍長度

        // 如果輸入在範圍內，則直接用輸入換算輸出，不需要考慮 range
        if (input >= inputStart && input < inputStart + mapRange) {
            const possibleNewOutput = outputStart + (input - inputStart)
            if (possibleNewOutput < output) output = possibleNewOutput
        }
        // 如果輸入 < inputStart，並且 輸入 + range 在範圍內，則直接用 inputStart 換算輸出，不需要考慮 mapRange，輸出會是 outputStart
        if (input < inputStart && input + range >= inputStart) {
            const possibleNewOutput = outputStart
            if (possibleNewOutput < output) output = possibleNewOutput
        }
    })

    // 輸入的號碼都沒又對應的範圍可以轉換成輸出時，用輸入作為輸出
    if (output === Infinity) output = input

    // 回傳輸出
    return output
}
