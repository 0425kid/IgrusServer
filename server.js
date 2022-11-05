const express = require('express');
const app = express();
var template = require('./lib/template.js');
const path = require('path');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false }));

var compression = require('compression');
app.use(compression());

let isLogedin = false; //로그인 상태를 체크하는 불 변수

//var bootstrap = require('bootstrap');

//postgres 연결 코드
const {Pool} = require('pg');
const pg = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'posts',
  password: 'password',
  port: 5432 //postgres의 기본 포트인듯?
})

//postgres 잘 연결됐는지 확인
pg.connect(err => {
  if(err) console.log(err);
  else{
    console.log("postgres connected");
  }
})

app.get('/', function(request, response) {
    pg.query(`SELECT * FROM post`, function(err, posts){
      var title = "IGRUS home";
      var description = "Welcome to igrus.net";
      var postlist = template.list(posts.rows);
      var html = template.HTML(title, postlist,
        `<h2>${title}</h2>${description}`,
        `
        <a href="/create">글쓰기</a>
        <hr>
        <a href="/login">로그인</a>
        <a href="/signup">회원가입</a>
        `
      );
      response.send(html);
    })
  });


  app.get('/post/:postId', function(request, response){
    var filteredId = path.parse(request.params.postId).base;
    pg.query(`SELECT * FROM post`, function(err, posts){
      var postlist = template.list(posts.rows);
      pg.query(`SELECT * FROM post WHERE id='${filteredId}'`, function(err2, post){
        var _post = post.rows[0]
        var title = _post.title;
        var description = _post.description;
        var author = _post.author;
        var created = _post.created;

        var html = template.HTML(title, postlist,
        `<h2>${title}</h2>
        <p>by ${author}</p>
        <hr>
        <p>${description}</p>
        <hr>
        <p>작성일 : ${created}</p>
        `,
        `<a href="/create">글쓰기</a>
          <a href="/update/${filteredId}">글 수정</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${filteredId}">
            <input type="submit" value="삭제">
          </form>`
        );
        response.send(html);
      })
    })
  });


  app.get('/create', function(request, response){
    pg.query(`SELECT * FROM post`, function(err, posts){ //account table에 존재하는 모든 데이터 불러옴
      if(err){
        throw err;
      }
  
      var title = '글 작성';
      var postlist = template.list(posts.rows);
      var html = template.HTML(title, postlist,
            `<h2>새 글 작성</h2>
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="제목" required></p>
                <textarea name="description" placeholder="내용" required></textarea>
                <p><input type="text" name="author" placeholder="작성자" required></p>
                <input type="submit" value="저장">
            </form>`, ''
          )
      response.send(html);
    });
  });
  
  
  app.post('/create_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var author = post.author;
    pg.query(`
    INSERT INTO post (title, description, author, created) values ($1, $2, $3, now());
    `, [title, description, author],
      function(err, result) {
        if(err) {
          throw err;
        }
        response.redirect(`/`);
      })
  });
  
  app.post('/delete_process', function(request, response){
    var post = request.body;
    pg.query(`DELETE FROM post WHERE id = '${post.id}';`, function(err){
      if(err) {
        throw err;
      }
      response.redirect(`/`);
    })
  });


  app.get('/update/:postId', function(request, response){
    pg.query(`SELECT * FROM post`, function(err, posts){
      var filteredId = path.parse(request.params.postId).base;
      pg.query(`SELECT * FROM post WHERE id='${filteredId}'`, function(err2, post){
        var _post = post.rows[0];
        var _title = _post.title;
        var _description = _post.description;
        var _author = _post.author;

        var title = '글 수정';
        var postlist = template.list(posts.rows);
        var html = template.HTML(title, postlist,
              `<h2>글 수정</h2>
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${filteredId}">
                  <p><input type="text" name="title" placeholder="제목" value="${_title}" required></p>
                  <p><textarea name="description" placeholder="내용" required>${_description}</textarea></p>
                  <p><input type="text" name="author" placeholder="작성자" value="${_author}" required></p>
                  <input type="submit" value="저장">
              </form>`, ''
            )
        response.send(html);
      })
    })
  });


  app.post('/update_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var author = post.author;
    var id = post.id;
    pg.query(`
    UPDATE post SET title=$1, description=$2, author=$3 WHERE id=$4
    `, [title, description, author, id],
      function(err, result) {
        if(err) {
          throw err;
        }
        response.redirect(`/`);
      })
  });

  app.get('/signup', function(request, response){
    var title = '회원가입 페이지';
      var html = template.HTML(title, '',
            `<h2>회원 가입을 환영합니다</h2>
            <form action="/signup_process" method="post">
            <p><input type="text" name="username" placeholder="닉네임"></p>
              <p><input type="text" name="user_id" placeholder="아이디"></p>
              <p><input type="text" name="user_pw" placeholder="비밀번호"></p>
              <p>
                <input type="submit" value="회원가입">
              </p>
            </form>`, ''
          )
      response.send(html);
  });

  app.post('/signup_process', function(request, response){
    var post = request.body;
    console.log(post);

    var id = post.user_id;
    var pw = post.user_pw;
    var name = post.username;

    console.log(id, pw, name);

    pg.query(`
    INSERT INTO account (user_id, user_pw, username, created) VALUES ($1, $2, $3, now());
    `, [id, pw, name],
      function(err, result) {
        if(err) {
          throw err;
        }
        response.redirect(`/`);
      })

    
  });

app.listen(8080, () => console.log('Example app listening on port 3000!'));
