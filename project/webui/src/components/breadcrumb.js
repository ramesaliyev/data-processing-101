import {Breadcrumb, Divider, Row, Col, Dropdown, Menu} from 'antd';

const MainMenu = (
  <Menu>
    <Menu.Item key="jobs">
      <a href="/jobs">Job Manager</a>
    </Menu.Item>
    <Menu.Item key="files">
      <a href="/files">File Browser</a>
    </Menu.Item>
  </Menu>
);

export function createBreadCrumb(items = []) {
  return (
    <Row justify="start" style={{paddingBottom: '10px'}}>
      <Col>
        <Dropdown
          overlay={MainMenu}
          trigger={['click']}
        >
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            Menu
          </a>
        </Dropdown>
      </Col>
      <Col>
        <Breadcrumb>
          <Breadcrumb.Separator>/</Breadcrumb.Separator>
          {items.map(item =>
            <Breadcrumb.Item key={item.route || item.name}>
              {item.route ?
                <a href={item.route}>{item.name}</a> :
                item.name  
              }
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </Col>
    </Row>
  );
}