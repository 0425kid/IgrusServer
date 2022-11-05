module.exports = {
    HTML:function(title, list, body, control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">HOME</a></h1>
        ${list}
        ${control}
        <hr>
        ${body}
      </body>
      </html>
      `;
    },
    list:function(posts){
      var list = '<ol>';
      var i = 0;
      while(i < posts.length){
        list = list + `<li><a href="/post/${posts[i].id}">${posts[i].title}    -${posts[i].author}</a></li>`;
        i = i + 1;
      }
      list = list+'</ol>';
      return list;
    },
    addList:function(posts){
      for(account in posts) {
        var liArea = document.getElementById('postlist');
        var newLI = document.createElement("li");
        newLI.innerHTML = `<a href="/account/${account.id}">${account.username}</a>`
  
        liArea.appendChild(newLI);
      }
  
    }
  }
  