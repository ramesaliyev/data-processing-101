import {Menu, Breadcrumb} from 'antd';

const MainMenu = (
  <Menu>
    <Menu.Item>
      <a href="/jobs">Jobs</a>
    </Menu.Item>
    <Menu.Item>
      <a href="/files">Files</a>
    </Menu.Item>
  </Menu>
);

export function createBreadCrumb(items = []) {
  return (
    <Breadcrumb>
      <Breadcrumb.Item overlay={MainMenu}>
        <a>Menu</a>
      </Breadcrumb.Item>
      {items.map(item =>
        <Breadcrumb.Item key={item.route || item.name}>
          {item.route ?
            <a href={item.route}>{item.name}</a> :
            item.name  
          }
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
}