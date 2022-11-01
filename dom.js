function create_pTag(){
    let tagArea = document.getElementById('tagArea');
    let new_pTag = document.createElement('p');
    new_pTag.setAttribute('class', 'pTag');
    new_pTag.innerHTML = pTagCount+". 추가된 p태그";
    tagArea.appendChild(new_pTag);
}
function create_hTag(){
    let tagArea = document.getElementById('tagArea');
    let new_hTag = document.createElement('h'+hTagCount);
    
    new_hTag.innerHTML = "추가된 h"+hTagCount+"태그";
    
    tagArea.appendChild(new_hTag);
}

function create_babo() {
    var name=document.getElementById('name').value;
    if(name="")return;
    let tagArea = document.getElementById('tagArea');
    let new_bTag = document.createElement('p');
    
    new_bTag.innerHTML =  name + " 바보";
    tagArea.appendChild(new_bTag);
}