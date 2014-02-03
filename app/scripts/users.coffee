
# users一覧をjsonとして出力する
# 100人ごとに、100.json, 200.json, 300.json...とする
# 基本的に追加するだけ

page = 1
per_page = 100

User.find().paginate page, per_page, (err, results, total) ->
    str = JSON.stringify {users:results}
    fs.writeFileSync("", str)
