config = require "config"
request = require "request"
fs = require "fs"
mkdirp = require "mkdirp"

imagemagick = require "imagemagick-native"

twitterApi = require "twitter"

class TwitterClient
    constructor: (key, secret) ->
        @data = null
        @twitter = new twitterApi
            consumer_key: config.twitter.consumerKey
            consumer_secret: config.twitter.consumerSecret
            access_token_key: key
            access_token_secret: secret
        return @
    createIeiriIcon: (screen_name, callback) ->
        ieiriFace = "./static/ieiri.png"
        originalDir = "./static/icons/original/#{screen_name.slice(0,2)}"
        originalPath = "#{originalDir}/#{screen_name}.png"
        baseDir = "./static/icons/base/#{screen_name.slice(0,2)}"
        basePath = "#{baseDir}/#{screen_name}.png"
        ieiriDir = "./static/icons/ieiri/#{screen_name.slice(0,2)}"
        ieiriPath = "#{ieiriDir}/#{screen_name}.png"
        # 顔面合成
        createIeiri = (src, callback) ->
            fs.readFile ieiriFace, (error, comp) ->
                newIcon = imagemagick.composite
                    srcData: src
                    compositeData: comp
                    format: "PNG"
                mkdirp ieiriDir, (err)->
                    fs.writeFile ieiriPath,newIcon, {encoding:"binary"}, (error)->
                        callback()
        # PNGアイコン取得
        createIcon = (callback) =>
            # ユーザープロフィールAPIで画像のURL得る
            @twitter.showUser screen_name, (user)=>
                originalExt = user.profile_image_url.split(".")
                originalExt = originalExt[originalExt.length-1]
                originalURL = user.profile_image_url.replace(/_normal/, "")
                # 画像のURLをget
                request {url:originalURL, encoding:null}, (err, res, body)->
                    if err or res.statusCode != 200
                        console.log "error", err
                        return
                    mkdirp originalDir, (err)->
                        fs.writeFile "#{originalDir}/#{screen_name}.#{originalExt}", body, {encoding:"binary"}, (error)->
                            # 必ずpngで500x500で保存しておく
                            png = imagemagick.convert
                                srcData: body
                                format: "PNG"
                                width: 500
                                height: 500
                            mkdirp baseDir, (err)->
                                fs.writeFile basePath, png, {encoding:"binary"}, (error)->
                                    createIeiri(png, callback)
        # まだファイルがないときだけ実行する
        fs.exists basePath, (exists) ->
            if not exists
                createIcon(callback)
            else
                fs.exists ieiriPath, (exists) ->
                    if not exists
                        fs.readFile basePath, (error, src)->
                            createIeiri(src, callback)
                    else
                        callback()

    changeIconIeiri: (screen_name, done) ->
        console.log "changeNameIeiri", screen_name
        apiUrl = 'https://api.twitter.com/1.1/account/update_profile_image.json'
        ieiriPath = "./static/icons/ieiri/#{screen_name.slice(0,2)}/#{screen_name}.png"
        fs.readFile ieiriPath, (err, data) =>
            if err
                console.log err
                done({result:"failed"})
            else
                base64image = data.toString("base64")
                content = {image:base64image}
                @twitter.post apiUrl, content, ->
                    done({result:"succeed"})
    revertIcon: ->
        # TODO
        @getOriginalSettings (data) ->
            @loadIcon data.profile_image_url

    changeNameIeiri: (name, done) ->
        console.log "changeNameIeiri", name
        newName = "家入一真非公式広報 #{name}"
        content =
            name: newName
        @twitter.updateProfile content, ->
            done({result:"succeed"})
    revertName: ->
        # TODO
        @getOriginalSettings (data) ->
            @twitter.updateProfile {name:data.name}
    autoRT: (id, done)->
        @twitter.retweetStatus id, (err)->
            if err?
                done "error"
            else
                done(null, {result:"succeed"})
    autoTweet: (done)->
        console.log "try autoTweet"
        #text = "東京都知事候補者 家入一真 http://ieirikazuma.com/"
        text = "東̺̪̞̊͋̌ͅ京̭̦̫͎̜̑ͭ̃͘都ͫ̈ͧ̌ͯͧ͗知̠͔̰͛̋͝事̜̭̻͕̗̰̗候͏̺補͓͈͉͎͕̪̱͑̌̈́̚̕者̥͖̝̤͈̠ͅ　͙͒ͭ̋ͩͭ͋̅家͈̥̺̆̏̎̆入̨͇̹一̷̱͔͖͇̖̭͇ͭ̃ͮ̇真͉͔̱̟̠̩̰̄"
        #text = "東̼͔̌̎ͅ京̞̬̑̐͐͠都͒́͗͏̘̜̻̮͕̱̜知̀事̞̦̟͎͓͑͑候͟補̷͈͍̥͎̫͙́̐ͅ者ͯ̇̒͛̑　̝̬̋̿̏̅̆̐͟家̥̙̮̻̋͜入̼͇̥̗̄ͨ一͎̥͝真̳̗̜̗̫̗ͅ"
        @twitter.updateStatus text, (data)=>
            console.log data.statusCode
            if data.statusCode in [400, 401, 403]
                console.log "tweet 重複"
                @twitter.updateStatus "#{text} #{Math.floor(new Date().getTime()/1000)}", (data_)->
                    if data_.statusCode in [400, 401, 403]
                        console.log "tweet 失敗"
                        done "error"
                    else
                        done(data_, {result:"succeed"})
            else
                done(data, {result:"succeed"})

exports.TwitterClient = TwitterClient
