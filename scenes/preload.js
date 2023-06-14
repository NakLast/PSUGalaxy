class Preload extends Phaser.Scene {

    width = null
    height = null
    handlerScene = null
    sceneStopped = false

    constructor() {
        super('preload')
    }

    preload() {
        this.load.image('GameStart', 'assets/PSU-Galaxy.png')
        this.load.image('guide', 'assets/540x960-guide.png')
        this.load.image('space', 'assets/newSpace.png')
        this.load.image('ship', 'assets/new-space-ship.png')
        this.load.image('shipRotation', 'assets/lose-space-ship.png')
        this.load.image('laserBlue', 'assets/laserBlue.png')
        this.load.image('ufo', 'assets/newUfo.png')
        this.load.image('rock', 'assets/new-space-rock.png')
        this.load.image('HP', 'assets/new-HP.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('START1', 'assets/START1.png')
        this.load.image('START2', 'assets/START2.png')

        this.load.audio('BGM','audio/BGM.mp3')
        this.load.audio('boom','audio/boom.wav')
        this.load.audio('click','audio/click.wav')
        this.load.audio('GameOver','audio/GAMEOVER.mp3')
        this.load.audio('shipBoom', 'audio/ShipBoom.wav')
        this.load.audio('laserSound','audio/Laser.mp3')

        this.canvasWidth = this.sys.game.canvas.width
        this.canvasHeight = this.sys.game.canvas.height

        this.width = this.game.screenBaseSize.width
        this.height = this.game.screenBaseSize.height

        this.handlerScene = this.scene.get('handler')
        this.handlerScene.sceneRunning = 'preload'
        this.sceneStopped = false

        let progressBox = this.add.graphics()
        progressBox.fillStyle(0x000, 0.8)
        progressBox.fillRect((this.canvasWidth / 2) - (210 / 2), (this.canvasHeight / 2) - 5, 210, 30)
        let progressBar = this.add.graphics()

        this.load.on('progress', (value) => {
            progressBar.clear()
            progressBar.fillStyle(0xFF5758, 1)
            progressBar.fillRect((this.canvasWidth / 2) - (200 / 2), (this.canvasHeight / 2), 200 * value, 20)
        })

        this.load.on('complete', () => {
            progressBar.destroy()
            progressBox.destroy()
            this.time.addEvent({
                delay: this.game.debugMode ? 3000 : 4000,
                callback: () => {
                    this.sceneStopped = true   
                    this.scene.stop('preload')
                    this.handlerScene.cameras.main.setBackgroundColor('black')
                    this.handlerScene.launchScene('preload')
                },
                loop: false
            })
        })
    }

    create() {
        const { width, height } = this

        // CONFIG SCENE         
        this.handlerScene.updateResize(this)
        if (this.game.debugMode)
            this.add.image(width/2, height/2, 'GameStart').setOrigin(.5).setScale(1.5, 1.5)
        // CONFIG SCENE 

        // Add sound
        this.click = this.sound.add('click', {volume: 0.25})
        this.bgm = this.sound.add('BGM', {volume: 0.25})
        this.bgm.play({loop:true})

        this.start1 = this.add.image(width/2, height/2 - 130, 'START1').setOrigin(.1)
        this.start1.setScale(1, 1)
        this.start2 = this.add.image(width/2, height/2 - 130, 'START2').setOrigin(.1)
        this.start2.setScale(1, 1)

        this.start1.setInteractive();
        this.start2.setInteractive();
        this.start2.on('pointerover', () => {
            this.start2.setVisible(false)
            this.start1.setVisible(true)
        })
        
        this.start1.on('pointerout', () => {
            this.start2.setVisible(true)
            this.start1.setVisible(false)
        })

        this.start1.on('pointerdown', () => {
            // Sound stop all
            this.sound.stopAll()

            // Click sound
            this.click.play()

            this.scene.start('title')
        })
    }
}

export default Preload