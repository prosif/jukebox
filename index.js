const process = require('process');
const { Asset, Game, GameNode, Colors, Shapes, ShapeUtils } = require(process.env.SQUISH_PATH);

class Jukebox extends Game {
    static metadata() {
        return {
            aspectRatio: {x: 1, y: 1},
            squishVersion: '0756',
            author: 'Joseph Garcia',
            thumbnail: '29ac02d447cb1927369bfc7af0627ebe'
        };
    }

    constructor() {
        super();
        const baseColor = [255, 255, 0, 255];
        this.base = new GameNode.Shape({
            shapeType: Shapes.POLYGON,
            coordinates2d: ShapeUtils.rectangle(0, 0, 100, 100),
            fill: baseColor
        });

        this.jukebox = new GameNode.Asset({
            assetInfo: {
                'jukebox': {
                    pos: {
                        x: 25,
                        y: 25
                    },
                    size: {
                        x: 50,
                        y: 50
                    }
                }
            }
        });

        this.inputListener = new GameNode.Shape({
            shapeType: Shapes.POLYGON,
            coordinates2d: ShapeUtils.rectangle(25, 25, 50, 50),
            input: {
                type: 'file',
                oninput: (playerId, data) => {
                    console.log('got data from player');
                }
            }
        });

        this.jukebox.addChild(this.inputListener);
        
        this.startTime = 0;

        this.playButton = new GameNode.Shape({
            shapeType: Shapes.POLYGON,
            coordinates2d: ShapeUtils.rectangle(35, 80, 30, 15),
            fill: Colors.COLORS.GREEN,
            onClick: (playerId) => {
                const assetNode = new GameNode.Asset({
                    coordinates2d: ShapeUtils.rectangle(0, 0, 0, 0),
                    assetInfo: {
                        'default-audio': {
                            pos: {x: 0, y: 0},
                            size: {x: 0, y: 0},
                            startTime: this.startTime
                        }
                    }
                });
                this.base.addChild(assetNode);
            }
        });

        this.base.addChildren(this.jukebox, this.playButton);
    }

    handleNewPlayer() {
    }

    handlePlayerDisconnect() {
    }

    getLayers() {
        return [{root: this.base}];
    }

    getAssets() {
        return {
            'jukebox': new Asset({
                'id': '1d0d5a16ebfa6fe82f864b5ff418599d',
                'type': 'image'
            }),
            'default-audio': new Asset({
                'id': '9a5fd71e441439f73c4781a13281f726',
                'type': 'audio'
            })
        }
    }
}

module.exports = Jukebox;
