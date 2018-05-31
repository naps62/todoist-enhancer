// 30 minutes
const threshold = 30 * 60 * 1000;

const itemHasLaterTime = (item, currentDate) => {
  const hourEl = item.querySelector('.column_time .agenda_item__time span');

  if (!hourEl) {
    return;
  }

  const [hours, minutes] = hourEl.innerHTML.split(":");
  const itemDate = new Date(currentDate);
  itemDate.setHours(hours);
  itemDate.setMinutes(minutes);
  itemDate.setSeconds(0);

  console.log(itemDate);
  console.log(itemDate.getTime(), currentDate.getTime(), threshold);
  console.log(itemDate.getTime() - currentDate.getTime(), threshold);
  return itemDate.getTime() - currentDate.getTime() > threshold;
}

const itemHide = item => {
  item.style.opacity = 0.2;
}

const itemShow = item => {
  item.style.opacity = 1;
}

const itemParseIndent = item => {
  return parseInt(/indent_(\d+)/.exec(item.className)[1]) || 1;
}

const processAll = () => {
  const currentDate = new Date();

  items = Array.prototype.slice.call(
    document.querySelectorAll('ul.ul_today li.task_item')
  );

  const hiddenItems = [];
  const date = new Date();

  items.map(item => {
    if (itemHasLaterTime(item, date)) {
      hiddenItems.push(item.id);
      itemHide(item)
    } else {
      itemShow(item);
    }
  });

  //
  // loop through hidden items. when one is reached,
  // hide all of the subsequent items that have an indent level
  // greater than his.
  // once an equal-level indented task is found, stop hiding
  let inHiddenParent = false;
  let hiddenParentIndent = 0;

  for(var i = 0; i < items.length; ++i) {
    const item = items[i];

    // currently in a hidden task's child
    if (inHiddenParent) {
      const currentItemIndent = itemParseIndent(item);

      // if new item is at same level or to the left of the hidden one,
      // we're done with hiding childs
      if (hiddenParentIndent >= currentItemIndent) {
        inHiddenParent = false;

      // otherwise, just hide the current one
      } else {
        itemHide(item);
      }
    } else {
      // if this item is hidden, start hiding it's sub tasks
      if (hiddenItems.includes(item.id)) {
        inHiddenParent = true;
        hiddenParentIndent = itemParseIndent(item)
      }
    }
  }
}

setInterval(processAll, 1000);

document.body.addEventListener('click', processAll);
