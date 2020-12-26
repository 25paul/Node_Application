let express = require('express');
let bodyParser = require('body-parser');
const app = express()

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json())
// This is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded())
// 
app.use(bodyParser.urlencoded({ extended: true }))

// 模型导入; 详情可见../database/models/index.js
const models = require('../database/models')

app.get('/', (req, res) => {
  res.json({
    message: 'hello'
  })
})

// app.get('/list', async (req, res, next) => {
//   next(new Error('haha'))
// })

// 创建一个todo
app.post('/create', async (req, res, next) => {
  try{
    console.log(req.body)
    let { name, deadline, content } = req.body;
    let todo = await models.Todo.create({
      name,
      deadline,
      content
    })
    res.json({
      todo,
      message: 'success'
    })
  } catch(error) {
    next(error)
  }
})

// 修改一个todo
app.post('/update', async (req, res, next) => {
  try {
    console.log('body', req.body)
    let { name, deadline, content, id } = req.body;
    let todo = await models.Todo.findOne({
      where: {
        id
      }
    })
    console.log(todo);
    if (todo) {
      todo = await todo.update({
        name,
        deadline,
        content
      })
    }
    res.json({
      todo
    })
  } catch (error) {
    next(error)
  }
})

// 修改一个todo、删除
app.post('/update_status', async (req, res, next) => {
  try {
    console.log(req.body);
    let { id, status } = req.body;
    let todo = await models.Todo.findOne({
      where: {
        id
      }
    })
    if (todo && status != todo.status) {
      todo = await todo.update({
        status
      })
    }
    res.json({
      todo
    })
  } catch (error) {

  }
})

// 查询任务列表
app.get('/list/:status/:page', async (req, res, next) => {
  // 状态：1待办、2完成、3删除、-1全部
  // 分页的处理
  console.log(req.params)
  let {status, page} = req.params;
  let limit = 10; // 每页的数量
  let offset = (page - 1) * limit;
  let where = {};
  if (status != -1) {
    where.status = status;
  }
  let list = await models.Todo.findAndCountAll({
    where,
    offset,
    limit
  }) 
  res.json({
    list,
    message: '列表查询成功'
  })
})

app.get('/list', async (req, res, next) => {
  // 状态：1待办、2完成、3删除、-1全部
  // 分页的处理
  let {status, page} = req.query;
  let limit = 10; // 每页的数量
  let offset = (page - 1) * limit;
  let where = {};
  if (status != -1) {
    where.status = status;
  }
  let list = await models.Todo.findAndCountAll({
    where,
    offset,
    limit
  }) 
  res.json({
    list,
    message: '列表查询成功'
  })
})

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

app.listen(3000, () => {
  console.log('3000 start')
})