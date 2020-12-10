module.exports = [
    {
        "key": "Enabled",
        "name": "开启(勾选) / 关闭(取消)",
        "type": "bool"
    },
    {
        "key": "Repeat",
        "name": "一鍵(连发) / 手动(发射)",
        "type": "bool"
    },
    {
        "key": "Move",
        "name": "移动(连发) / 移动(停止)",
        "type": "bool"
    },
    {
        "key": "Delay",
        "name": "连发延迟(单位ms)",
        "type": "number",
        "min": 1,
        "max": 99999,
        "step": 1
    },
    {
        "key": "Lockon",
        "name": "全屏锁定",
        "type": "bool"
    },
    {
        "key": "LockBoss",
        "name": "只锁Boss / 全屏怪物",
        "type": "bool"
    },
    {
        "key": "Distance",
        "name": "锁定范围(单位M)",
        "type": "number",
        "min": 1,
        "max": 100,
        "step": 1
    },
    {
        "key": "AutoMode",
        "name": "智能中断",
        "type": "bool"
    },
    {
        "key": "Hight",
        "name": "无敌高度",
        "type": "number",
        "min": 1,
        "max": 99999,
        "step": 1
    },
]
