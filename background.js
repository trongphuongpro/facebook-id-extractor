chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url.includes("facebook.com")) {
    return;
  }

  await chrome.tabs.reload();
  await sleep(3000);

  if (
    ["/posts/", "/permalink.php", "story_fbid"].some((kw) =>
      tab.url.includes(kw)
    ) &&
    tab.url.includes("facebook.com")
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: get_long_fbid,
      args: ["post"],
    });
  } else if (
    ["/videos", "/watch", "/reel", "/stories"].every(
      (kw) => !tab.url.includes(kw)
    ) &&
    tab.url.includes("facebook.com")
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: get_long_fbid,
      args: ["profile"],
    });
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function get_short_fbid(type) {
    function get_post_id() {
      let tag_1 = '"subscription_target_id":"';
      let tag_2 = '"';

      let body = document.body.innerHTML;
      let idx_1 = body.indexOf(tag_1);
      let idx_2 = 0;

      if (idx_1 != -1) {
        idx_2 = body.indexOf(tag_2, idx_1 + tag_1.length);
      } else {
        return null;
      }

      let target_id = body.substring(idx_1 + tag_1.length, idx_2);

      if (target_id.search(/^\d+$/) != -1) return target_id;

      return null;
    }

    function get_profile_id() {
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

    function craft_short_url(target_id) {
      let result = `https://www.facebook.com/${target_id}`;

      return result;
    }

    let target_id = "";

    if (type === "post") {
      target_id = get_post_id();
    }

    if (type === "profile") {
      target_id = get_profile_id();
    }

    if (target_id) {
      let result = craft_short_url(target_id);
      window.prompt("URL:", result);
    } else {
      window.alert("Hãy reload trang!");
    }
  }

  function get_long_fbid(type) {
    function get_post_id() {
      let tag_1 = '"subscription_target_id":"';
      let tag_2 = '"';

      let body = document.body.innerHTML;
      let idx_1 = body.indexOf(tag_1);
      let idx_2 = 0;

      if (idx_1 != -1) {
        idx_2 = body.indexOf(tag_2, idx_1 + tag_1.length);
      } else {
        return null;
      }

      let target_id = body.substring(idx_1 + tag_1.length, idx_2);

      if (target_id.search(/^\d+$/) != -1) return target_id;

      return null;
    }

    function get_profile_id() {
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

    function craft_short_url(target_id) {
      let result = `https://www.facebook.com/${target_id}`;

      return result;
    }

    function craft_long_url(target_id) {
      let separator_1 = "/posts/";
      let separator_2 = "&id=";
      let result = "";

      if (document.URL.indexOf(separator_1) != -1) {
        let base_url = document.URL.split(separator_1)[0];
        result = base_url + separator_1 + target_id;
      } else if (document.URL.indexOf(separator_2) != -1) {
        let user_id = document.URL.split(separator_2)[1];
        result = `https://www.facebook.com/${user_id}/posts/${target_id}`;
      }

      return result;
    }

    let target_id = "";

    if (type === "post") {
      target_id = get_post_id();
    }

    if (type === "profile") {
      target_id = get_profile_id();
    }

    if (target_id) {
      let result = "";

      if (type === "post") {
        result = craft_long_url(target_id);
      }

      if (type === "profile") {
        result = craft_short_url(target_id);
      }

      window.prompt("URL:", result);
    } else {
      window.alert("Hãy reload trang!");
    }
  }
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  console.log(`Command "${command}" triggered`);

  if (!tab.url.includes("facebook.com")) {
    return;
  }

  await chrome.tabs.reload();
  await sleep(3000);

  if (command === "get_short_url_with_owner") {
    if (
      ["/posts/", "/permalink.php", "story_fbid"].some((kw) =>
        tab.url.includes(kw)
      )
    ) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: get_long_fbid,
        args: ["post"],
      });
    } else if (
      ["/videos", "/watch", "/reel", "/stories"].every(
        (kw) => !tab.url.includes(kw)
      ) &&
      tab.url.includes("facebook.com")
    ) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: get_long_fbid,
        args: ["profile"],
      });
    }
  } else if (command === "get_short_url_no_owner") {
    if (
      ["/posts/", "/permalink.php", "story_fbid"].some((kw) =>
        tab.url.includes(kw)
      )
    ) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: get_short_fbid,
        args: ["post"],
      });
    } else if (
      ["/videos", "/watch", "/reel", "/stories"].every(
        (kw) => !tab.url.includes(kw)
      ) &&
      tab.url.includes("facebook.com")
    ) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: get_short_fbid,
        args: ["profile"],
      });
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function get_short_fbid(type) {
    function get_post_id() {
      let tag_1 = '"subscription_target_id":"';
      let tag_2 = '"';

      let body = document.body.innerHTML;
      let idx_1 = body.indexOf(tag_1);
      let idx_2 = 0;

      if (idx_1 != -1) {
        idx_2 = body.indexOf(tag_2, idx_1 + tag_1.length);
      } else {
        return null;
      }

      let target_id = body.substring(idx_1 + tag_1.length, idx_2);

      if (target_id.search(/^\d+$/) != -1) return target_id;

      return null;
    }

    function get_profile_id() {
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

    function craft_short_url(target_id) {
      let result = `https://www.facebook.com/${target_id}`;

      return result;
    }

    let target_id = "";

    if (type === "post") {
      target_id = get_post_id();
    }

    if (type === "profile") {
      target_id = get_profile_id();
    }

    if (target_id) {
      let result = craft_short_url(target_id);
      window.prompt("URL:", result);
    } else {
      window.alert("Hãy reload trang!");
    }
  }

  function get_long_fbid(type) {
    function get_post_id() {
      let tag_1 = '"subscription_target_id":"';
      let tag_2 = '"';

      let body = document.body.innerHTML;
      let idx_1 = body.indexOf(tag_1);
      let idx_2 = 0;

      if (idx_1 != -1) {
        idx_2 = body.indexOf(tag_2, idx_1 + tag_1.length);
      } else {
        return null;
      }

      let target_id = body.substring(idx_1 + tag_1.length, idx_2);

      if (target_id.search(/^\d+$/) != -1) return target_id;

      return null;
    }

    function get_profile_id() {
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

    function craft_short_url(target_id) {
      let result = `https://www.facebook.com/${target_id}`;

      return result;
    }

    function craft_long_url(target_id) {
      let separator_1 = "/posts/";
      let separator_2 = "&id=";
      let result = "";

      if (document.URL.indexOf(separator_1) != -1) {
        let base_url = document.URL.split(separator_1)[0];
        result = base_url + separator_1 + target_id;
      } else if (document.URL.indexOf(separator_2) != -1) {
        let user_id = document.URL.split(separator_2)[1];
        result = `https://www.facebook.com/${user_id}/posts/${target_id}`;
      }

      return result;
    }

    let target_id = "";

    if (type === "post") {
      target_id = get_post_id();
    }

    if (type === "profile") {
      target_id = get_profile_id();
    }

    if (target_id) {
      let result = "";

      if (type === "post") {
        result = craft_long_url(target_id);
      }

      if (type === "profile") {
        result = craft_short_url(target_id);
      }

      window.prompt("URL:", result);
    } else {
      window.alert("Hãy reload trang!");
    }
  }
});
