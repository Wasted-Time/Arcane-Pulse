const SettingsUI = require('tera-mod-ui').Settings

module.exports = function ArcanePulse(mod) {
	// Settings UI
	let ui = null
	if (global.TeraProxy.GUIMode) {
		ui = new SettingsUI(mod, require('./settings_structure'), mod.settings, { height: 390 })
		ui.on('update', settings => {
			mod.settings = settings
		})
		
		this.destructor = () => {
			if (ui) {
				ui.close()
				ui = null
			}
		}
	}
	// Command Chat
	mod.command.add("zc", () => { if (ui) ui.show() })
	
	const SETs = mod.settings
	const GAME = mod.game
	
	let Invincible = false
	let boss_ID = null
	let npcs = new Map()
	let job = -1
	
	let meLoc = {}
	let meW   = 0
	let hight = {}
	
	GAME.on('enter_game', () => {
		mod.clearAllIntervals()
		Invincible = false
		boss_ID = null
		npcs.clear()
		job = (GAME.me.templateId - 10101) % 100
	})
	
	GAME.on('leave_game', () => {
		mod.clearAllIntervals()
		Invincible = false
		boss_ID = null
		npcs.clear()
		job = -1
	})
	
	GAME.me.on('change_zone', () => {
		mod.clearAllIntervals()
		Invincible = false
		boss_ID = null
		npcs.clear()
	})
	
	GAME.me.on('die', () => {
		mod.clearAllIntervals()
	})
	
	mod.hook('C_PLAYER_LOCATION', 5, event => {
		if (!SETs.Move) mod.clearAllIntervals()
		meLoc = event.loc
		meW   = event.w
		if (!Invincible) return
		event.loc.z += SETs.Hight
		hight = event.loc
		return true
	})
	
	mod.hook('S_BOSS_GAGE_INFO', 3, event => {
		if (boss_ID && boss_ID==event.id) return
		boss_ID = event.id
	})
	
	mod.hook('S_USER_EFFECT', 1, event => {
		if (!SETs.AutoMode || !SETs.Repeat || boss_ID!=event.source) return
		if (GAME.me.is(event.target) && event.circle==2 && event.operation==1) mod.clearAllIntervals()
	})
	
	mod.hook('S_SPAWN_NPC', 11, event => {
		npcs.set(event.gameId, event.loc)
	})
	
	mod.hook('S_NPC_LOCATION', 3, event => {
		if (!npcs.get(event.gameId)) return
		npcs.set(event.gameId, event.loc)
	})
	
	mod.hook('S_DESPAWN_NPC', 3, event => {
		if (event.type!=1 && event.type!=5) return
		if (boss_ID == event.gameId) {
			boss_ID = null
			mod.clearAllIntervals()
		}
		npcs.delete(event.gameId)
	})
	
	mod.hook('C_USE_ITEM', 3, event => {
		if (event.id != 6560) return
		InvincibleMode(event)
		return false
	})
	
	mod.hook('C_START_SKILL', 7, event => {
		if (event.skill.id == 9100100) {
			InvincibleMode(event)
			return false
		}
		mod.clearAllIntervals()
	})
	
	mod.hook('C_START_INSTANCE_SKILL', 7, event => {
		mod.clearAllIntervals()
		if (!SETs.Enabled) return
		if (SETs.Repeat) {
			event.loc       = meLoc
			event.w         = meW
			event.endpoints = [meLoc]
		}
		if (job!=4 || Math.floor(event.skill.id/10000)!=1) return
		event.skill.id = 330112
		if (SETs.Repeat) mod.setInterval(StartInstanceSkill, SETs.Delay, event)
		return true
	})
	
	function StartInstanceSkill(event) {
		mod.send('C_START_INSTANCE_SKILL', 7, {
			skill:     event.skill,
			loc:       Invincible?hight:meLoc,
			w:         meW,
			continue:  event.continue,
			targets:   event.targets,
			endpoints: [Invincible?hight:meLoc]
		})
	}
	
	mod.hook('S_ACTION_STAGE', 9, event => {
		if (!SETs.Enabled || !GAME.me.is(event.gameId)) return
		if (event.skill.id==330112 && !event.moving) return false
	})
	
	mod.hook('C_HIT_USER_PROJECTILE', 4, event => {
		if (!SETs.Lockon) return
		if (SETs.LockBoss && boss_ID) {
			event.targets = [{gameId: boss_ID}]
		} else {
			npcs.forEach((value, key) => {
				if (getDistance(meLoc, value) < SETs.Distance*30) {
					event.targets.push({gameId: key})
				}
			})
		}
		return true
	})
	
	function getDistance(locA, locB) {
		return Math.sqrt(Math.pow((locA.x - locB.x), 2) + Math.pow((locA.y - locB.y), 2))
	}
	
	function InvincibleMode(event) {
		Invincible = !Invincible
		if (Invincible) {
			hight =  {
				x:event.loc.x,
				y:event.loc.y,
				z:event.loc.z + SETs.Hight
			}
			mod.send('S_ABNORMALITY_BEGIN', 3, {
				target: GAME.me.gameId,
				source: GAME.me.gameId,
				id: 2060,
				duration: 0x7FFFFFFF,
				unk: 0,
				stacks: 1,
				unk2: 0,
				unk3: 0
			})
		} else {
			meLoc = event.loc
			mod.send('S_ABNORMALITY_END', 1, {
				target: GAME.me.gameId,
				id: 2060
			})
			mod.send('S_INSTANT_MOVE', 3, {
				id: GAME.me.gameId,
				loc: meLoc,
				w: meW
			})
		}
		mod.command.message('无敌模式: ' + (Invincible?"启":"禁") + "用")
	}
}
