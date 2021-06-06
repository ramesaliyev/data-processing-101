import {AutoSizer, List} from 'react-virtualized';

function getDefaultRowRenderer({list}) {
  return function defaultRowRenderer({key, index, style}) {
    return (
      <div key={key} style={style}>
        {list[index]}
      </div>
    );
  }
}

export default function VirtualTable({list, getRowRenderer, rowHeight=30, heightMargin=0}) {
  const rowRenderer = getRowRenderer ? getRowRenderer({list}) : getDefaultRowRenderer({list});

  return (
    <AutoSizer>
      {({height, width}) => (
        <List
          height={height - heightMargin}
          rowCount={list.length}
          rowHeight={rowHeight}
          rowRenderer={rowRenderer}
          width={width}
        />
      )}
    </AutoSizer>
  );
}