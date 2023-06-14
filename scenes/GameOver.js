class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.GameOverMessage = data.GameOver_message;
    }

    addShip() {
        this.player = this.physics.add.sprite(this.width/2 - 20, this.height/2 + 80, 'shipRotation')
        this.player.setScale(0.15, 0.15)
    }

    addGameOver() {
        this.gameoverHUD = this.add.text(this.width/2 - 200, 300, "Game Over", 
            {fontSize: '70px', fill: '#FF0000', fontWeight: 'bold', stroke: '#FF0000', strokeThickness: 6});
    }

    addScore() {
        this.gameoverHUD = this.add.text(this.width/2 - 100, 375, this.GameOverMessage, 
            {fontSize: '32px', fill: '#FFF', fontWeight: 'bold', stroke: '#FFF', strokeThickness: 3});    
    }

    addPlayAgain() {
        this.playagainHUD = this.add.text(this.width/2 - 230, 420, 'Click here to play again', 
            {fontSize: '30px', fill: '#FF0000', fontWeight: 'bold', stroke: '#FF0000', strokeThickness: 2})
    }

    playagainEvent() {
        this.playagainHUD.on('pointerover', () => {
            this.playagainHUD.setStyle({fill : "#FFF", fontWeight: 'bold', stroke: '#FFF', strokeThickness: 2})
        })

        this.playagainHUD.on('pointerout', () => {
            this.playagainHUD.setStyle({fill : '#FF0000', fontWeight: 'bold', stroke: '#FF0000', strokeThickness: 2})
        })

        this.playagainHUD.on('pointerdown', () => {
            // Sound stop all
            this.sound.stopAll()

            // Click sound
            this.click.play()

            this.scene.start('title')
        })
    }

    addBGM() {
        this.bgm = this.sound.add('GameOver', {volume: 0.05})
        this.bgm.play({loop: true})
    }

    addCilck() {
        this.click = this.sound.add('click', {volume: 0.25})
        this.click.play()
    }

    preload() {
        this.sceneStopped = false
        this.width = this.game.screenBaseSize.width
        this.height = this.game.screenBaseSize.height
        this.handlerScene = this.scene.get('handler')
        this.handlerScene.sceneRunning = 'GameOver'
    }

    create() {
        const { width, height } = this

        // CONFIG SCENE         
        this.handlerScene.updateResize(this)
        if (this.game.debugMode) {
            this.add.image(width/2, height/2, 'space').setOrigin(.5)
        }
        // CONFIG SCENE 

        this.addShip()

        //Text Creation
        this.addGameOver()
        this.addScore()
        this.addPlayAgain()
        this.playagainHUD.setInteractive()
        this.playagainEvent()

        // BGM
        this.addBGM()
        this.addCilck()
    }

    update() {
        this.player.rotation += 0.05
    }
}

export default GameOver