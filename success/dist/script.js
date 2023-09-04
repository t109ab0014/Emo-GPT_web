"use strict";
/*//////////////
3D情緒波形圖
////////////////*/
function chart_container() {
    var dom = document.getElementById('chart-container');
    var myChart = echarts.init(dom, 'dark', {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};
    var option;
    function lerpColor(a, b, t) {
        return a.map((c, i) => Math.round(c + (b[i] - c) * t));
    }
    function getColor(x, y) {
        const colors = {
            topLeft: [0, 0, 139],
            top: [0, 191, 255],
            topRight: [0, 128, 0],
            left: [255, 255, 224],
            center: [255, 255, 255],
            right: [128, 0, 128],
            bottomLeft: [178, 0, 112],
            bottom: [255, 0, 0],
            bottomRight: [255, 255, 0], // 黃色
        };
        const tX = (x + 1) / 2;
        const tY = (y + 1) / 2;
        const topColor = lerpColor(colors.topLeft, colors.topRight, tX);
        const bottomColor = lerpColor(colors.bottomLeft, colors.bottomRight, tX);
        const leftColor = lerpColor(colors.topLeft, colors.bottomLeft, tY);
        const rightColor = lerpColor(colors.topRight, colors.bottomRight, tY);
        const centerColor = colors.center;
        const horizontalColor = lerpColor(leftColor, rightColor, tX);
        const verticalColor = lerpColor(topColor, bottomColor, tY);
        const finalColor = [
            (horizontalColor[0] + verticalColor[0] + centerColor[0]) / 3,
            (horizontalColor[1] + verticalColor[1] + centerColor[1]) / 3,
            (horizontalColor[2] + verticalColor[2] + centerColor[2]) / 3,
        ];
        return `rgb(${finalColor[0]}, ${finalColor[1]}, ${finalColor[2]})`;
    }
    function computeZ(x, y) {
        let data = [
            { x: -0.7, y: -0.6, z: 0.9, sigmaX: 0.25, sigmaY: 0.25 },
            { x: 0, y: 0, z: 0.3, sigmaX: 0.25, sigmaY: 0.25 },
            ///{ x: +0.5, y: -0.9, z: 0.7, sigmaX: 0.25, sigmaY: 0.25 }
        ];
        let sum = 0;
        data.forEach((point) => {
            let gaussian = point.z * Math.exp(-((x - point.x) ** 2 / (2 * point.sigmaX ** 2) + (y - point.y) ** 2 / (2 * point.sigmaY ** 2)));
            sum += gaussian;
        });
        return sum;
    }
    option = {
        tooltip: {},
        backgroundColor: '#0006',
        xAxis3D: {
            type: 'value',
        },
        yAxis3D: {
            type: 'value',
        },
        zAxis3D: {
            type: 'value',
        },
        grid3D: {
            viewControl: {
            // projection: 'orthographic'
            },
        },
        series: [
            {
                type: 'line3D',
                data: (function () {
                    let data = [];
                    for (let x = -1.5; x <= 1.5; x += 0.05) {
                        for (let y = -1.5; y <= 1.5; y += 0.05) {
                            data.push([x, y, computeZ(x, y)]);
                        }
                    }
                    for (let y = -1.5; y <= 1.5; y += 0.05) {
                        for (let x = -1.5; x <= 1.5; x += 0.05) {
                            data.push([x, y, computeZ(x, y)]);
                        }
                    }
                    return data;
                })(),
                lineStyle: {
                    width: 2,
                    color: function (params) {
                        const [x, y] = params.value;
                        return getColor(x, y);
                    },
                },
            },
        ],
    };
    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
    window.addEventListener('resize', myChart.resize);
}
chart_container();
/*//////////////
購買意向圖
////////////////*/
function container_1() {
    var dom = document.getElementById('container_1');
    var myChart = echarts.init(dom, 'dark', {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var option;
    option = {
        backgroundColor: '#0006',
        series: [
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '75%'],
                radius: '90%',
                min: 0,
                max: 1,
                splitNumber: 8,
                axisLine: {
                    lineStyle: {
                        width: 6,
                        color: [
                            [0.25, '#FF6E76'],
                            [0.5, '#FDDD60'],
                            [0.75, '#58D9F9'],
                            [1, '#7CFFB2']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '12%',
                    width: 20,
                    offsetCenter: [0, '-60%'],
                    itemStyle: {
                        color: 'inherit'
                    }
                },
                axisTick: {
                    length: 12,
                    lineStyle: {
                        color: 'inherit',
                        width: 2
                    }
                },
                splitLine: {
                    length: 20,
                    lineStyle: {
                        color: 'inherit',
                        width: 5
                    }
                },
                axisLabel: {
                    color: '#464646',
                    fontSize: 20,
                    distance: -60,
                    rotate: 'tangential',
                    formatter: function (value) {
                        if (value === 0.875) {
                            return 'Grade A';
                        }
                        else if (value === 0.625) {
                            return 'Grade B';
                        }
                        else if (value === 0.375) {
                            return 'Grade C';
                        }
                        else if (value === 0.125) {
                            return 'Grade D';
                        }
                        return '';
                    }
                },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 20
                },
                detail: {
                    fontSize: 30,
                    offsetCenter: [0, '-35%'],
                    valueAnimation: true,
                    formatter: function (value) {
                        return Math.round(value * 100) + '';
                    },
                    color: 'inherit'
                },
                data: [
                    {
                        value: 0.7,
                        name: '可能性分數'
                    }
                ]
            }
        ]
    };
    option && myChart.setOption(option);
}
container_1();
/*//////////////
風險雷達圖
////////////////*/
function container_2() {
    var dom = document.getElementById('container_2');
    var myChart = echarts.init(dom, 'dark', {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};
    var option;
    // Schema:
    // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
    const dataBJ = [
        [55, 9, 56, 0.46, 18, 6, 1],
        [25, 11, 21, 0.65, 34, 9, 2],
        [56, 7, 63, 0.3, 14, 5, 3],
        [33, 7, 29, 0.33, 16, 6, 4],
        [42, 24, 44, 0.76, 40, 16, 5],
        [82, 58, 90, 1.77, 68, 33, 6],
        [74, 49, 77, 1.46, 48, 27, 7],
        [78, 55, 80, 1.29, 59, 29, 8],
        [267, 216, 280, 4.8, 108, 64, 9],
        [185, 127, 216, 2.52, 61, 27, 10],
        [39, 19, 38, 0.57, 31, 15, 11],
        [41, 11, 40, 0.43, 21, 7, 12],
        [64, 38, 74, 1.04, 46, 22, 13],
        [108, 79, 120, 1.7, 75, 41, 14],
        [108, 63, 116, 1.48, 44, 26, 15],
        [33, 6, 29, 0.34, 13, 5, 16],
        [94, 66, 110, 1.54, 62, 31, 17],
        [186, 142, 192, 3.88, 93, 79, 18],
        [57, 31, 54, 0.96, 32, 14, 19],
        [22, 8, 17, 0.48, 23, 10, 20],
        [39, 15, 36, 0.61, 29, 13, 21],
        [94, 69, 114, 2.08, 73, 39, 22],
        [99, 73, 110, 2.43, 76, 48, 23],
        [31, 12, 30, 0.5, 32, 16, 24],
        [42, 27, 43, 1, 53, 22, 25],
        [154, 117, 157, 3.05, 92, 58, 26],
        [234, 185, 230, 4.09, 123, 69, 27],
        [160, 120, 186, 2.77, 91, 50, 28],
        [134, 96, 165, 2.76, 83, 41, 29],
        [52, 24, 60, 1.03, 50, 21, 30],
        [46, 5, 49, 0.28, 10, 6, 31]
    ];
    const dataGZ = [
        [26, 37, 27, 1.163, 27, 13, 1],
        [85, 62, 71, 1.195, 60, 8, 2],
        [78, 38, 74, 1.363, 37, 7, 3],
        [21, 21, 36, 0.634, 40, 9, 4],
        [41, 42, 46, 0.915, 81, 13, 5],
        [56, 52, 69, 1.067, 92, 16, 6],
        [64, 30, 28, 0.924, 51, 2, 7],
        [55, 48, 74, 1.236, 75, 26, 8],
        [76, 85, 113, 1.237, 114, 27, 9],
        [91, 81, 104, 1.041, 56, 40, 10],
        [84, 39, 60, 0.964, 25, 11, 11],
        [64, 51, 101, 0.862, 58, 23, 12],
        [70, 69, 120, 1.198, 65, 36, 13],
        [77, 105, 178, 2.549, 64, 16, 14],
        [109, 68, 87, 0.996, 74, 29, 15],
        [73, 68, 97, 0.905, 51, 34, 16],
        [54, 27, 47, 0.592, 53, 12, 17],
        [51, 61, 97, 0.811, 65, 19, 18],
        [91, 71, 121, 1.374, 43, 18, 19],
        [73, 102, 182, 2.787, 44, 19, 20],
        [73, 50, 76, 0.717, 31, 20, 21],
        [84, 94, 140, 2.238, 68, 18, 22],
        [93, 77, 104, 1.165, 53, 7, 23],
        [99, 130, 227, 3.97, 55, 15, 24],
        [146, 84, 139, 1.094, 40, 17, 25],
        [113, 108, 137, 1.481, 48, 15, 26],
        [81, 48, 62, 1.619, 26, 3, 27],
        [56, 48, 68, 1.336, 37, 9, 28],
        [82, 92, 174, 3.29, 0, 13, 29],
        [106, 116, 188, 3.628, 101, 16, 30],
        [118, 50, 0, 1.383, 76, 11, 31]
    ];
    const dataSH = [
        [91, 45, 125, 0.82, 34, 23, 1],
        [65, 27, 78, 0.86, 45, 29, 2],
        [83, 60, 84, 1.09, 73, 27, 3],
        [109, 81, 121, 1.28, 68, 51, 4],
        [106, 77, 114, 1.07, 55, 51, 5],
        [109, 81, 121, 1.28, 68, 51, 6],
        [106, 77, 114, 1.07, 55, 51, 7],
        [89, 65, 78, 0.86, 51, 26, 8],
        [53, 33, 47, 0.64, 50, 17, 9],
        [80, 55, 80, 1.01, 75, 24, 10],
        [117, 81, 124, 1.03, 45, 24, 11],
        [99, 71, 142, 1.1, 62, 42, 12],
        [95, 69, 130, 1.28, 74, 50, 13],
        [116, 87, 131, 1.47, 84, 40, 14],
        [108, 80, 121, 1.3, 85, 37, 15],
        [134, 83, 167, 1.16, 57, 43, 16],
        [79, 43, 107, 1.05, 59, 37, 17],
        [71, 46, 89, 0.86, 64, 25, 18],
        [97, 71, 113, 1.17, 88, 31, 19],
        [84, 57, 91, 0.85, 55, 31, 20],
        [87, 63, 101, 0.9, 56, 41, 21],
        [104, 77, 119, 1.09, 73, 48, 22],
        [87, 62, 100, 1, 72, 28, 23],
        [168, 128, 172, 1.49, 97, 56, 24],
        [65, 45, 51, 0.74, 39, 17, 25],
        [39, 24, 38, 0.61, 47, 17, 26],
        [39, 24, 39, 0.59, 50, 19, 27],
        [93, 68, 96, 1.05, 79, 29, 28],
        [188, 143, 197, 1.66, 99, 51, 29],
        [174, 131, 174, 1.55, 108, 50, 30],
        [187, 143, 201, 1.39, 89, 53, 31]
    ];
    const lineStyle = {
        width: 1,
        opacity: 0.5
    };
    option = {
        backgroundColor: '#0006',
        legend: {
            bottom: 5,
            data: ['A', 'B', 'C'],
            itemGap: 20,
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            selectedMode: 'single'
        },
        radar: {
            indicator: [
                { name: '社交工程', max: 300 },
                { name: '冒充客戶', max: 250 },
                { name: '偽造訂單', max: 300 },
                { name: '信息洩漏', max: 5 },
                { name: '惡意軟體', max: 200 },
                { name: '內部員工', max: 100 }
            ],
            shape: 'circle',
            splitNumber: 5,
            axisName: {
                color: 'rgb(238, 197, 102)'
            },
            splitLine: {
                lineStyle: {
                    color: [
                        'rgba(238, 197, 102, 0.1)',
                        'rgba(238, 197, 102, 0.2)',
                        'rgba(238, 197, 102, 0.4)',
                        'rgba(238, 197, 102, 0.6)',
                        'rgba(238, 197, 102, 0.8)',
                        'rgba(238, 197, 102, 1)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(238, 197, 102, 0.5)'
                }
            }
        },
        series: [
            {
                name: 'A',
                type: 'radar',
                lineStyle: lineStyle,
                data: dataBJ,
                symbol: 'none',
                itemStyle: {
                    color: '#F9713C'
                },
                areaStyle: {
                    opacity: 0.1
                }
            },
            {
                name: 'B',
                type: 'radar',
                lineStyle: lineStyle,
                data: dataSH,
                symbol: 'none',
                itemStyle: {
                    color: '#B3E4A1'
                },
                areaStyle: {
                    opacity: 0.05
                }
            },
            {
                name: 'C',
                type: 'radar',
                lineStyle: lineStyle,
                data: dataGZ,
                symbol: 'none',
                itemStyle: {
                    color: 'rgb(238, 197, 102)'
                },
                areaStyle: {
                    opacity: 0.05
                }
            }
        ]
    };
    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
    window.addEventListener('resize', myChart.resize);
}
container_2();