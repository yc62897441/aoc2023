// 外部引入檔案
const fs = require('fs')
// const filename = 'input.txt'
const filename = './day5/input.txt'

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

readData()
async function readData() {
    try {
        const data = fs.readFileSync(filename, 'utf8', async function (err, data) {
            if (err) throw err
            return data
        })
        const dataSplit = data.split('\n')

        // 取得各組 [種子, 範圍]
        const seedSets = []
        const temp = dataSplit[0].split(' ').filter((item) => item !== 'seeds:')
        temp.forEach((item, index) => {
            if (index % 2 === 0) {
                seedSets.push([item, temp[index + 1]])
            }
        })

        // 取得各個轉換的 map(每個 map 中的資料，用陣列存起來)
        let currentArrayName = ''
        dataSplit.forEach((item) => {
            if (table[item]) currentArrayName = item
            if (item && item !== currentArrayName) {
                table[currentArrayName]?.push(item)
            }
        })

        // 各個種子的最終轉換結果
        const results = []

        seedSets.forEach((seedSet) => {
            let input = seedSet[0]
            let range = seedSet[1]

            // 把輸入轉換成輸出，依照 n 轉換的 map 來轉換
            arrayNames.forEach((arrayName) => {
                input = getOutput(arrayName, input, range)
            })

            // 把種子的最終轉換結果存起來
            results.push(input)
        })

        // 找出 lowest location number
        let result = Infinity
        results.forEach((item) => {
            if (Number(item) < Number(result)) result = Number(item)
        })

        // 印出 lowest location number
        console.log('result', result)
    } catch (error) {
        console.log(error)
    }
}

function getOutput(arrayName, input, range) {
    let output = Infinity

    table[arrayName].forEach((item) => {
        const itemSplit = item.split(' ')
        const outputStart = itemSplit[0] // 目標範圍起點
        const inputStart = itemSplit[1] // 來源範圍起點
        const mapRange = itemSplit[2] // map 範圍長度

        // 如果輸入在範圍內，則直接用輸入換算輸出，不需要考慮 range
        if (
            Number(input) >= Number(inputStart) &&
            Number(input) < Number(inputStart) + Number(mapRange)
        ) {
            const possibleNewOutput = Number(outputStart) + (Number(input) - Number(inputStart))
            if (possibleNewOutput < output) output = possibleNewOutput
        }
        // 如果輸入 < inputStart，並且 輸入 + range 在範圍內，則直接用 inputStart 換算輸出，不需要考慮 mapRange，輸出會是 outputStart
        if (
            Number(input) < Number(inputStart) &&
            Number(input) + Number(range) >= Number(inputStart)
        ) {
            const possibleNewOutput = Number(outputStart)
            if (possibleNewOutput < output) output = possibleNewOutput
        }
    })

    // 輸入的號碼都沒又對應的範圍可以轉換成輸出時，用輸入作為輸出
    if (output === Infinity) output = Number(input)

    // 回傳輸出
    return output
}
