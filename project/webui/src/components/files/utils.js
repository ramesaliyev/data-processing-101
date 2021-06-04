import path from 'path';
import set from 'lodash/set';
import take from 'lodash/take';
import omit from 'lodash/omit';

function encodeDotSafe(string) {
  return string.replace(/\./g, '@@@');
}

function decodeDotSafe(string) {
  return string.replace(/@@@/g, '.');
}

function toArray(tree) {
  const root = {
    ...tree.$$meta,
    children: Object.values(omit(tree, ['$$meta']))
      .map(v => v.leafNodeType ? v : toArray(v)),
  };

  return root;
}

export function parsePaths(records) {
  const tree = {
    $$meta: {key: '/', title: '/'},
  };

  // parse
  for (const record of records) {
    const [type, filepath] = record.split(':');

    const parts = filepath.split('/').slice(1).map(encodeDotSafe);
    const parents = parts.slice(0, -1);

    for (let i = 0; i < parents.length; i++) {
      const ownParents = take(parents, i + 1);
      const ownParentsPath = ownParents.join('.');
      const ownParentsKey = path.join(...ownParents.map(decodeDotSafe));

      set(tree, `${ownParentsPath}.$$meta.key`, `/${ownParentsKey}`);
      set(tree, `${ownParentsPath}.$$meta.title`, parents[i]);
    }

    set(tree, parts.join('.'), {
      title: decodeDotSafe(parts.slice(-1)[0]),
      key: decodeDotSafe(path.join(...['/', ...parts])),
      isLeaf: type === 'file',
      leafNodeType: true,
    });
  }

  // format as array.
  return [toArray(tree)];
}