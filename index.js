const process = require('process');
const { Asset, Game, GameNode, Colors, Shapes, ShapeUtils } = require(process.env.SQUISH_PATH);

class Jukebox extends Game {
    static metadata() {
        return {
            aspectRatio: {x: 1, y: 1},
            squishVersion: '0756',
            author: 'Joseph Garcia',
            thumbnail: '29ac02d447cb1927369bfc7af0627ebe',
            description: `The jukebox looks like a dude. Don't upload files larger than 5MB.`
        };
    }

    constructor({ addAsset }) {
        super();

        this.addAsset = addAsset;

        const baseColor = [255, 255, 0, 255];

        this.assets = {
            'jukebox': new Asset({
                'id': '1d0d5a16ebfa6fe82f864b5ff418599d',
                'type': 'image'
            }),
            'default-audio': new Asset({
                'id': '9a5fd71e441439f73c4781a13281f726',
                'type': 'audio'
            })
        }

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

        this.customSong = null;

        this.inputListener = new GameNode.Shape({
            shapeType: Shapes.POLYGON,
            coordinates2d: ShapeUtils.rectangle(25, 25, 50, 50),
            input: {
                type: 'file',
                oninput: (playerId, data) => {
                    this.customSong = data;
                    const assetKey = 'custom' + Date.now();
                    this.assets[assetKey] = new Asset({
                        id: assetKey,
                        type: 'audio'
                    }, data);
                    this.addAsset(assetKey, this.assets[assetKey]).then(() => {
                        this.base.removeChild(this.assetNode.id);
                        this.assetNode = new GameNode.Asset({
                            assetInfo: {
                                [assetKey]: {
                                    pos: {
                                        x: 0,
                                        y: 0
                                    },
                                    size: {
                                        x: 0,
                                        y: 0
                                    },
                                    startTime: 0
                                }
                            }
                        });

                        this.base.addChild(this.assetNode);
                    });
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
                this.assetNode = new GameNode.Asset({
                    coordinates2d: ShapeUtils.rectangle(0, 0, 0, 0),
                    assetInfo: {
                        'default-audio': {
                            pos: {x: 0, y: 0},
                            size: {x: 0, y: 0},
                            startTime: this.startTime
                        }
                    }
                });
                this.base.addChild(this.assetNode);
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
        return this.assets;
    }
}

module.exports = Jukebox;
