function get_uid() {
  let target_id = get_user_id();

  if (target_id !== null) {
    result = craft_url(target_id);
    navigator.clipboard.writeText(result);
    window.prompt("URL:", result);
  } else {
    window.alert("Hãy reload trang!");
  }
}

function get_user_id() {
  let tag_1_list = [
    '"groupID":"',
    '"pageID":"',
    '"userID":"',
    '"profile_owner":{"id":"',
  ];
  let tag_2 = '"';

  let body = document.body.innerHTML;

  for (tag of tag_1_list) {
    let idx_1 = body.indexOf(tag);
    let idx_2 = 0;

    if (idx_1 == -1) {
      continue;
    } else {
      idx_2 = body.indexOf(tag_2, idx_1 + tag.length);
    }

    let target_id = body.substring(idx_1 + tag.length, idx_2);

    if (target_id.search(/^\d+$/) != -1) {
      return target_id;
    }
  }

  return null;
}

function craft_url(target_id) {
  let result = `https://www.facebook.com/${target_id}`;

  return result;
}

get_uid();
