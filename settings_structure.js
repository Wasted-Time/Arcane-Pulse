module.exports = [
    {
        "key": "Enabled",
        "name": "On (Check) / Close (Cancel)",
        "type": "bool"
    },
    {
        "key": "Repeat",
        "name": "Key (Burst) / Manual (launch)",
        "type": "bool"
    },
    {
        "key": "Move",
        "name": "Mobile (Burst) / Move (stop)",
        "type": "bool"
    },
    {
        "key": "Delay",
        "name": "Burst Delay (ms)",
        "type": "number",
        "min": 1,
        "max": 99999,
        "step": 1
    },
    {
        "key": "Lockon",
        "name": "Full Screen Lock",
        "type": "bool"
    },
    {
        "key": "LockBoss",
        "name": "Lock OnlyBoss / Full Screen Monster",
        "type": "bool"
    },
    {
        "key": "Distance",
        "name": "Lock range(UnitM)",
        "type": "number",
        "min": 1,
        "max": 100,
        "step": 1
    },
    {
        "key": "AutoMode",
        "name": "Smart Interrupt",
        "type": "bool"
    },
    {
        "key": "Hight",
        "name": "Invincible Hight",
        "type": "number",
        "min": 1,
        "max": 99999,
        "step": 1
    },
]
