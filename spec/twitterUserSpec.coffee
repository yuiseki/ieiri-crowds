
# 量産型家入一真
{TwitterClient} = require "../app/twitterClient"

token = "2158391-L1PKc9lxGJpRawUq8RuRYlwUubtcsjl3D3qwOXCzED"
secret = "QlLiaKf3PQ7jUE6nml2079NrY1EzIP1cCp2lzxqACcc9G"

{MongoClient} = require "mongodb"
dbpath = "mongodb://localhost:27017/ieiri_test"

describe "class TwitterClient", ->
    user = null; done = null
    mongodb = null; collection = null
    beforeEach ->
        done = null
    it "setup mongodb", ->
        MongoClient.connect dbpath, (error, db) ->
            mongodb = db
            collection = db.collection('twitter_user')
            collection.remove (error, result)->
                console.log error if error?
                done = true
        waitsFor ->
            return done
    it "newできる", ->
        user = new TwitterClient token, secret
        expect(user).not.toBe null
    it "saveOnceできる", ->
        user.saveOnce (result) =>
            result
        waitsFor ->
            collection.count {id:2158391}, (error, count) ->
                done = (count==1)
            return done
    it "すでにsaveOnceしていたら二回目以降はしない", ->
        user.saveOnce (result) =>
            done = result
        waitsFor ->
            return (done == false)
    it "オリジナルの設定を読み出しできる", ->
        user.getOriginalSettings (data) =>
            expect(data).not.toBe null
            expect(data.screen_name).toBe "yuiseki"
            done = true
        waitsFor ->
            return done
    describe "ユーザー名変更", ->
        it "ユーザー名を家入一真にできる", ->
            user.changeDisplayName()
            expect(user.getDisplayName()).toBe "家入一真"
        it "ユーザー名を元に戻せる", ->
            user.revertDisplayName()
            expect(user.getDisplayName()).toBe original_name
    describe "アイコン変更", ->
        user.changeIcon()
        expect(user.getIcon()).toBe ieiriIcon

    it "disconnect", ->
        user.disconnect()
        mongodb.close()

###
describe "アイコン変更", ->
    it "アイコンの初期値を取得して保存しておける", ->
        originalIcon = user.saveIcon()
        expect(originalIcon).not.toBe null
    it "アイコンを家入一真にできる", ->
    it "アイコンを元に戻せる", ->
        user.revertIcon()
        expect(user.getIcon()).toBe originalIcon
        "アイコンをランダムにグリッチできる"

# twitter streaming api で @hbkr を監視
describe "自動RT", ->
    it "家入一真のアカウントが何かツイートしたら全てRTできる", ->
    it "家入一真のアカウントが何かRTしたら全てRTできる", ->

###
