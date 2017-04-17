import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Navbar, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap'

export class Navigation extends Component {
  render () {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Birdly</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="#">About</NavItem>
          <NavItem eventKey={2} href="#">Help</NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default Navigation;
