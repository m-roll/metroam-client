import React from 'react';

const NavSelectOrigin = (props) => (
    <div className={"input-group inline"}>
        <div className={"input-group-prepend"}>
            <span className={"input-group-text"}>
            From origin:
            </span>
        </div>
        <select className={"form-control"} onChange={(e) => props.onOriginChange(e.target.value)}>
            <option value={"northeastern"}>Northeastern</option>
            <option value={"harvard"}>Harvard</option>
            <option value={"cityhall"}>City Hall</option>
            <option value={"airport"}>Logan</option>
        </select>
    </div>
);

export default NavSelectOrigin;