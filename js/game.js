var structureStats = {
  treehouse : {
    maxHealth: 10,
    repairable: true
  }
}

class Structure {
  type;
  health;
  boundKapas;

  constructor(type) {
    if (type in structureStats) {
      this.type = type
      var stats = structureStats[type]
      this.health = 0
      this.boundKapas = 0
    } else {
      throw new Error("Structure ${type} not recognized")
    }
  }

  build() {
    var maxHealth = structureStats[this.type].maxHealth
    var health = this.health
    if (health < maxHealth && this.boundKapas > 0) {
      health += this.boundKapas
      if (health > maxHealth) {
        health = maxHealth
      }
      this.health = health
    }
    if (health == maxHealth) {
      this.boundKapas = 0
    }
  }
}

var structures = []

activistBase = 10
activistCount = activistBase

// capacities
capacities = {
    repro: {
      boundKapas: 0
    }
}

// returns the current activist limit
getActivistLimit = function() {
  return activistBase + capacities.repro.boundKapas * 7
}

//
recruitActivists = function() {
  limit = getActivistLimit()
  add = Math.floor()(limit - activistCount) / 3)
  activistCount = activistCount + add
}

boundInCapacities = function() {
  var n = 0
  for (c in capacities) {
    n += capacities[c].boundKapas
  }
  return n
}

boundInBuilding = function() {
  var n = 0
  for (s in structures) {
    n += structures[s].boundKapas
  }
  return n
}

freeActivists = function() {
  return activistCount - (boundInCapacities() + boundInBuilding())
}

buildTreehouse = function() {
  treehouse = new Structure("treehouse")
  freeKapas = freeActivists()
  if (freeActivists < 3) {
    treehouse.boundKapas = freeActivists
  } else {
    treehouse.boundKapas = 3
  }
  structures.push(treehouse)
}

treehouseCount = function() {
  n = 0
  for (s of structures) {
    if (s.type == "treehouse") {
      n++
    }
  }
  return n
}

increaseRepro = function() {
  if (freeActivists() > 0) {
    capacities.repro.boundKapas++
  }
}

debugStructures = function() {
  console.log(structures)
}

updateUI = function() {
  document.getElementById("activist-count").innerHTML = activistCount
  document.getElementById("free-activists").innerHTML = freeActivists()
  document.getElementById("capacity-count").innerHTML = boundInCapacities()
  document.getElementById("build-count").innerHTML = boundInBuilding()
  document.getElementById("treehouse-count").innerHTML = treehouseCount()

}

bindUI = function() {
  document.getElementById("increase-repro").onclick = increaseRepro
  document.getElementById("build-treehouse").onclick = buildTreehouse
}

gameFinished = false
gameLoop = 0

loop = function() {
  console.log("loop")
  console.log(capacities)
  console.log(structures)
  if (gameFinished) {
    clearInterval(gameLoop)
    return
  }

  recruitActivists()

  // Build process
  for (s of structures) {
    s.build()
  }

  updateUI()
}

bindUI()
loop()
gameLoop = window.setInterval(loop, 2000)
