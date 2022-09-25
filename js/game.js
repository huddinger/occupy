var structureStats = {
  treehouse : {
    maxBuilders: 3,
    maxHealth: 10,
    repairable: true
  }
}



class Structure {
  id;
  type;
  health;
  progress;
  builders;

  constructor (id) {
    this.id = id
    this.health = 0
    this.progress = 0
    this.builders = 0
  }

  build() {
    let maxHealth = structureStats[this.type].maxHealth

    // make progress
    this.health += this.builders

    // finished
    if (this.health >= maxHealth)
      this.health = maxHealth

    this.progress = Math.round((this.health / maxHealth) * 100)
  }
}

class Treehouse extends Structure {
  constructor(id) {
    super(id)
    this.type = "treehouse"
  }
}


//
// Having all structures defined
// we can build our village
//


//
// Important note:
// Builder management is done by the village class
//
class Village {
  nextStructureId;
  structures;
  villagers;

  constructor() {
    this.structures = {}
    this.nextStructureId = 0

    this.villagers = {
      baseCapacity : 10,
      capacity: 10,
      total: 10,
      free: 10,
      support: 0,
      builders: 0
    }
  }

  structureCount(type) {
    let n = 0
    for (let id in this.structures)
      if (this.structures[id].type == type)
        n++
    return n
  }

  assignBuilders(id) {
    let struct = this.structures[id]
    let max = structureStats[struct.type].maxBuilders
    let req = max - struct.builders

    let available = this.villagers.free

    //how many additional builders can we mobilize?
    let add = available < req ? available : req

    struct.builders += add
    this.villagers.free -= add
    this.villagers.builders += add
  }

  releaseBuilders(id) {
    let n = this.structures[id].builders
    this.structures[id].builders = 0
    this.villagers.free += n
    this.villagers.builders -= n
  }

  build() {
    for (let id in this.structures) {
      this.structures[id].build()
      if (this.structures[id].progress == 100 && this.structures[id].builders > 0)
        this.releaseBuilders(id)
    }
  }

  addTreehouse() {
    // technical stuff
    let id = this.nextStructureId++
    let treehouse = new Treehouse(id)
    this.structures[id] = treehouse
    this.assignBuilders(id)
  }

  increaseSupport() {
    var v = this.villagers

    if (v.free == 0)
      return

    v.support++
    v.free--
    v.capacity = v.baseCapacity + 7 * v.support
  }

  recruitVillagers() {
    let v = this.villagers
    let add = Math.floor((v.capacity - v.total) / 3)
    v.total += add
    v.free += add
  }
}



game = {
  timeframe: 0,
  isFinished: false,
  loopId: undefined,
  village: new Village()
}

//
// UI Functions
//

uihandlers = {
  increaseSupport : function(e) {game.village.increaseSupport()},
  addTreehouse: function(e) {game.village.addTreehouse()}
}

updateUI = function() {
  let vs = game.village.villagers
  document.getElementById("game-timeframe").innerHTML = game.timeframe
  document.getElementById("vs-capacity").innerHTML = vs.capacity
  document.getElementById("vs-villagers").innerHTML = vs.total
  document.getElementById("vs-free").innerHTML = vs.free
  document.getElementById("vs-repro").innerHTML = vs.support
  document.getElementById("vs-builders").innerHTML = vs.builders
  document.getElementById("struct-treehouse-count").innerHTML = game.village.structureCount("treehouse")
}


bindUI = function() {
  document.getElementById("action-increase-repro").addEventListener("click", uihandlers.increaseSupport)
  document.getElementById("action-build-treehouse").addEventListener("click", uihandlers.addTreehouse)
}

function loop() {
  game.timeframe++

  v = game.village
  v.recruitVillagers()
  v.build()

  updateUI()

  if (game.isFinished)
    clearInterval(game.loopId)
}


bindUI()
loop()
game.loopId = window.setInterval(loop, 2000)
