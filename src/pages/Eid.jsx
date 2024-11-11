import { Tab, Row, Nav } from "react-bootstrap";
import About from "./Tabs.jsx/About";
import { useState } from "react";

export default function Eid() {
  const [activeKey, setActiveKey] = useState("about");

  const handleSelect = (key) => {
    setActiveKey(key);
  };

  const getLinkStyle = (key) => {
    return activeKey === key
      ? { backgroundColor: "#E5E5E599", color: "#000000" } // Active styles
      : { backgroundColor: "#ffffff", color: "#000000" }; // Default styles
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full ml-10">
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey="about"
            onSelect={handleSelect}
          >
            <Row>
              <Nav variant="pills" className="flex">
                <Nav.Item>
                  <Nav.Link eventKey="about" style={getLinkStyle("about")}>
                    關於
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="issue" style={getLinkStyle("issue")}>
                    永續合作
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="foot_print"
                    style={getLinkStyle("foot_print")}
                  >
                    數位足跡
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="wallet" style={getLinkStyle("wallet")}>
                    領取任務
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>
            <Row>
              <Tab.Content>
                <Tab.Pane eventKey="about">
                  <About />
                </Tab.Pane>
                <Tab.Pane eventKey="issue"></Tab.Pane>
                <Tab.Pane eventKey="foot_print"></Tab.Pane>
                <Tab.Pane eventKey="wallet"></Tab.Pane>
              </Tab.Content>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </>
  );
}