import React from 'react';
interface HeaderProps {
title?: string;
}
const Header: React.FC<HeaderProps> = ({ title = "Chat" }) => {
return (
<div className="header">
<h1>{title}</h1>
</div>
);
};
export default Header;
