class Title extends Phaser.Scene {

    handlerScene = false
    sceneStopped = false

    constructor() {
        super('title')

        this.score = 0
    }

    gameScene() {
        if(this.player.x <= 0 + (this.player.getBounds().width/2)) {
            this.player.x = (this.player.getBounds().width/2)
        }else if(this.player.x >= this.width - (this.player.getBounds().width/2)) {
            this.player.x = this.width - (this.player.getBounds().width/2)
        }

        if(this.player.y <= 0 + (this.player.getBounds().height/2)) {
            this.player.y = (this.player.getBounds().height/2)
        }else if(this.player.y >= this.height - (this.player.getBounds().height/2)) {
            this.player.y = this.height - (this.player.getBounds().height/2)
        }
    }

    addShip() {
        this.player = this.physics.add.sprite(this.width/2, this.height - 90, 'ship').setOrigin(.5)
    }

    addEvents() {
        this.pointer = {
            isDown: false,
            x: this.width/2,
            y: this.height - 90
        }
        this.input.on('pointerdown', (pointer) => {
            this.pointer.isDown = true
            this.pointer.x = pointer.worldX
            this.pointer.y = pointer.worldY
        })
        this.input.on('pointermove', (pointer) => {
            this.pointer.x = pointer.worldX
            this.pointer.y = pointer.worldY
        })
        this.input.on('pointerup', () => {
            this.pointer.isDown = false
        })
        
    }

    addEventsUpdate() {
        const {pointer, player} = this
        const PLAYER_SPEED = 50
        if(pointer.isDown) {
            const difX = pointer.x - player.x
            const difY = pointer.y - player.y

            if(
                Math.abs(difX) < PLAYER_SPEED &&
                Math.abs(difY) < PLAYER_SPEED
            ) {
                player.x = pointer.x
                player.y = pointer.y
            } else {
                const direction = new Phaser.Math.Vector2(difX, difY).normalize()

                player.x += direction.x * PLAYER_SPEED
                player.y += direction.y * PLAYER_SPEED
            }
        }
    }

    shootLaser() {
        this.laserBlue = this.physics.add.sprite(this.player.x, this.player.y - 50, 'laserBlue')
        this.laserBlue.body.velocity.y = -900

        this.laserBlueGrp.add(this.laserBlue)
    }

    updateShootLaser() {
        for (var i =0; i < this.laserBlueGrp.getChildren().length; i++) {
            this.laserBlue = this.laserBlueGrp.getChildren()[i]

            if(this.laserBlue.y < this.height - 900) {
                this.laserBlue.destroy()
            }
        }
    }

    addUFO() {  
        const ufoSpacing = 100
        
        for(var i = 0; i < 5; i++) {
            this.ufo = this.physics.add.sprite(0 + (i * ufoSpacing), 0, 'ufo')
            this.ufo.speed = (Math.random() * 2) + 1
            this.ufo.startY = this.height - 1200
            this.ufo.startX = 0 + (i * ufoSpacing)
            this.ufo.y = this.ufo.startY
            this.ufo.x = this.ufo.startX
            this.ufo.magintude = Math.random() * 60

            this.ufoGrp.add(this.ufo)
        }
    }

    updateUFO() {
        for(var i = 0; i < this.ufoGrp.getChildren().length; i++) {
            this.enemy = this.ufoGrp.getChildren()[i]
            this.enemy.y += this.enemy.speed
            this.enemy.x = this.enemy.startX + (Math.sin(this.game.getTime()/1000) * this.enemy.magintude)

            if(this.enemy.y > this.height) {
                this.enemy.speed = (Math.random() * 2) + 1
                this.enemy.y = this.enemy.startY 
                this.enemy.magintude = Math.random() * 60
            }
        }
    }

    onUFOHit(ufo, laserBlue) {
        this.addUFOBoom()
        laserBlue.disableBody(true, true)
        ufo.y = ufo.startY
        ufo.speed = (Math.random() * 2) + 1

        this.score += 10
        this.scoreText.setText('SCORE: ' + this.score)
    }

    addRock() {
        const rockSpacing = 130

        for(var i = 0; i < 5; i++) {
            this.rock = this.physics.add.sprite(100 + (i * rockSpacing), 0, 'rock')
            this.rock.speed = (Math.random() * 2) + 1
            this.rock.startY = this.height - 1200
            this.rock.startX = 0 + (i * rockSpacing)
            this.rock.y = this.rock.startY
            this.rock.x = this.rock.startX
            this.rock.magintude = Math.random() * 60

            this.rockGrp.add(this.rock)
        }
    }

    updateRock() {
        for(var i = 0; i < this.rockGrp.getChildren().length; i++) {
            this.enemy = this.rockGrp.getChildren()[i]
            this.enemy.y += this.enemy.speed
            this.enemy.x = this.enemy.startX + (Math.sin(this.game.getTime()/1000) * this.enemy.magintude)

            if(this.enemy.y > this.height) {
                this.enemy.speed = (Math.random() * 2) + 1
                this.enemy.y = this.enemy.startY 
                this.enemy.magintude = Math.random() * 60
            }
        }
    }

    onRockHit(rock, laserBlue) {
        laserBlue.destroy()
    }

    addShipHP() {
        this.HPText = this.add.text(545 - this.width, this.height - 926, "HP: ", {fontSize: '20px', stroke: '#FFF', strokeThickness: 2});

        for(var i = 0; i < this.shipHP; i++) {
            this.HP = this.add.sprite(55 + (i * 25), 45, 'HP')
            this.HP.setScale(0.1, 0.1)

            this.HPGrp.add(this.HP)
        }
    }

    addStar() {
        this.star = this.physics.add.sprite(0, 0, 'star');
        this.star.speed = (Math.random() * 2) + 1
        this.star.startY = this.height - 1200
        this.star.y = this.star.startY
    }

    addScore() {
        this.scoreText = this.add.text(this.width - 140, this.height - 926,'SCORE: ' + this.score, {fontSize: '20px', fontWeight: 'bold', stroke: '#FFF', strokeThickness: 2})
    }

    addBGM(){
        this.bgm = this.sound.add('BGM', {volume: 0.25})
        this.bgm.play({loop:true})
    }

    addLaserSound() {
        this.laserBlueSound = this.sound.add('laserSound', {volume: 0.1})
        this.laserBlueSound.play()
    }

    addUFOBoom() {
        this.UFOBoom = this.sound.add('boom', {volume: 0.15})
        this.UFOBoom.play()
    }

    addShipBoom() {
        this.shipBoomSound = this.sound.add('shipBoom', {volume: 0.25})
        this.shipBoomSound.play()
    }

    preload() {
        this.sceneStopped = false
        this.width = this.game.screenBaseSize.width
        this.height = this.game.screenBaseSize.height

        this.handlerScene = this.scene.get('handler')
        this.handlerScene.sceneRunning = 'title'
        // Orientation
        this.scale.lockOrientation(this.game.orientation)
    }

    create() {
        const { width, height } = this

        // CONFIG SCENE
        this.handlerScene.updateResize(this)
        if (this.game.debugMode) {
            this.add.image(width/2, height/2, 'space').setScale(0.8, 0.6)      
        }
        // CONFIG SCENE 

        this.addShip()
        this.laserBlueGrp = this.add.group()
        this.addEvents()
        this.ufoGrp = this.add.group()
        this.addUFO()
        this.rockGrp = this.add.group()
        this.addRock()

        // Add sound
        this.addBGM()

        // Ship HP
        this.shipHP = 3
        this.deltaNoDamageTime = 0
        this.deltaShooting = 0
        this.HPGrp = this.add.group()
        this.addShipHP()

        // Player score
        this.addScore()

        // check collisions
        this.physics.add.overlap(this.ufoGrp, this.laserBlueGrp, this.onUFOHit, null, this)
        this.physics.add.overlap(this.rockGrp, this.laserBlueGrp, this.onRockHit)
        this.physics.add.overlap(this.player, this.ufoGrp, (b1, b2) => {
            if(this.deltaNoDamageTime > 2000) {
                this.shipHP--
                for(var i = this.HPGrp.getChildren().length - 1; i >= 0; i--){
                    if(this.shipHP < i+1){
                        this.HPGrp.getChildren()[i].setVisible(false)
                    }else {
                        this.HPGrp.getChildren()[i].setVisible(true)
                    }
                }
                this.deltaNoDamageTime = 0
                console.log(this.shipHP)

                if(this.shipHP == 0) {
                    this.addShipBoom()
                    this.sound.stopAll()
                    this.scene.start("GameOver", { GameOver_message: "SCORE: " + this.score })
                }
            }
        })
        this.physics.add.overlap(this.player, this.rockGrp, (b1, b2) => {
            if(this.deltaNoDamageTime > 2000) {
                this.shipHP--
                for(var i = this.HPGrp.getChildren().length - 1; i >= 0; i--){
                    if(this.shipHP < i+1){
                        this.HPGrp.getChildren()[i].setVisible(false)
                    }else {
                        this.HPGrp.getChildren()[i].setVisible(true)
                    }
                }
                this.deltaNoDamageTime = 0
                console.log(this.shipHP)

                if(this.shipHP == 0) {
                    this.addShipBoom()
                    this.sound.stopAll()
                    this.scene.start("GameOver", { GameOver_message: "SCORE: " + this.score })
                }
            }
        })
    }

    update(time, delta) {
        this.gameScene()
        this.updateShootLaser()
        this.updateUFO()
        this.updateRock()
        this.addEventsUpdate()
        this.deltaNoDamageTime += delta
        this.deltaShooting += delta
        while(this.deltaShooting > 100){
            this.shootLaser()
            this.addLaserSound()
            this.deltaShooting = 0
        }
    }

}

export default Title