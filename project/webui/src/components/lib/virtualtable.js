import {AutoSizer, List} from 'react-virtualized';



export default function VirtualTable({list}) {
  function rowRenderer({key, index, style}) {
    return (
      <div key={key} style={style}>
        {list[index]}
      </div>
    );
  }

  return (
    <AutoSizer>
      {({height, width}) => (
        <List
          height={height}
          rowCount={list.length}
          rowHeight={30}
          rowRenderer={rowRenderer}
          width={width}
        />
      )}
    </AutoSizer>
  );
}