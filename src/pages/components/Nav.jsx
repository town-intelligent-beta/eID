import Logo from "../../assets/Second Home logo.svg";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

export default function Nav() {
  return (
    <Navbar className="mb-10">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={Logo}
            width="240"
            className="d-inline-block align-top"
            alt="Second Home logo"
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
