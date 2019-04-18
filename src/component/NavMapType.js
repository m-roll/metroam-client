import React from 'react';

const NavMapType = (props) => (
    <ul className={"nav nav-pills white"}>
        <li className={"nav-item mr-4"}>
            <a onClick={(e) => props.onNav("lyft-dur")}
               className={"nav-link "  + (props.currentType === "lyft-dur" ? "active" : "")}
               href={"#"}>Lyft duration</a>
        </li>
        <li className={"nav-item mr-4"}>
            <a onClick={(e) => props.onNav("lyft-price")}
               className={"nav-link " + (props.currentType === "lyft-price" ? "active" : "")}
               href={"#"}>Lyft pricing</a>
        </li>
        <li className={"nav-item"}>
            <a onClick={(e) => props.onNav("transit-dur")}
               className={"nav-link " + (props.currentType === "transit-dur" ? "active" : "")}
               href={"#"}>Transit duration</a>
        </li>
    </ul>
);

export default NavMapType;