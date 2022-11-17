function get_uid() {
    let target_id = get_post_id();

    if (target_id !== null) {
        result = craft_url(target_id);
        navigator.clipboard.writeText(result);
        window.prompt('URL:', result);
    }

    for (let tag of ['m.facebook', 'mobile.facebook']) {
        if (location.href.includes(tag)) {
            location.href = location.href.replace(tag, 'www.facebook');
        }
    }
}

function get_post_id() {
    let tag_1 = 'S:_I';
    let tag_2 = '&quot';

    let body = document.body.innerHTML;
    let idx_1 = body.indexOf(tag_1);
    let idx_2 = 0;

    if (idx_1 != -1) {
        idx_2 = body.indexOf(tag_2, idx_1 + tag_1.length);
    }
    else {
        return null;
    }

    let id_list = body.substring(idx_1 + tag_1.length, idx_2).split(':');
    let target_id = id_list[id_list.length - 1];

    if (target_id.search(/^\d+$/) != -1) 
        return target_id;
    
    return null;
}


function craft_url(target_id) {
    let separator_1 = '/posts/';
    let separator_2 = '&id=';
    let result = '';
    
    if (document.URL.indexOf(separator_1) != -1) {
        let base_url = document.URL.split(separator_1)[0];
        result = base_url + separator_1 + target_id;
    }
    
    else if (document.URL.indexOf(separator_2) != -1) {
        let user_id = document.URL.split(separator_2)[1];
        result = `https://www.facebook.com/${user_id}/posts/${target_id}`;
    }

    return result.replace('m.facebook', 'www.facebook');
}

get_uid();