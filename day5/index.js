// 外部引入檔案
const fs = require('fs')
const filename = 'input.txt'

const table = {
    'seed-to-soil map:': [],
    'soil-to-fertilizer map:': [],
    'fertilizer-to-water map:': [],
    'water-to-light map:': [],
    'light-to-temperature map:': [],
    'temperature-to-humidity map:': [],
    'humidity-to-location map:': [],
}
const arrayNames = ['seed-to-soil map:', 'soil-to-fertilizer map:', 'fertilizer-to-water map:', 'water-to-light map:', 'light-to-temperature map:', 'temperature-to-humidity map:', 'humidity-to-location map:']

readData()
async function readData() {
    try {
        const data = fs.readFileSync(filename, 'utf8', async function (err, data) {
            if (err) throw err
            return data
        })
        const dataSplit = data.split('\n')

        // 取得各個種子
        const seeds = dataSplit[0].split(' ').filter((item) => item !== 'seeds:')

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

        seeds.forEach((seed) => {
            let input = seed

            // 把輸入轉換成輸出，依照 n 轉換的 map 來轉換
            arrayNames.forEach((arrayName) => {
                input = getOutput(arrayName, input)
            })

            // 把種子的最終轉換結果存起來
            results.push(input)
        })

        // 找出 lowest location number
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

function getOutput(arrayName, input) {
    let output = "haven't found"

    table[arrayName].forEach((item) => {
        if (output !== "haven't found") return

        const itemSplit = item.split(' ')
        const outputStart = itemSplit[0] // 目標範圍起點
        const inputStart = itemSplit[1] // 來源範圍起點
        const mapRange = itemSplit[2] // 範圍長度

        // 如果輸入在範圍內，則換算輸出
        if (Number(input) >= Number(inputStart) && Number(input) < Number(inputStart) + Number(mapRange)) {
            output = Number(outputStart) + (Number(input) - Number(inputStart))
        }
    })

    // 輸入的號碼都沒又對應的範圍可以轉換成輸出時，用輸入作為輸出
    if (output === "haven't found") output = input

    // 回傳輸出
    return output
}
