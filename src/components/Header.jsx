import styled from "styled-components";
import logoImage from "../../public/sophia_LOGO.png";
const Logo = styled.img`
  height: 100px;
  width: auto;
  margin-right: 1rem;

  @media (max-width: 600px) {
    margin-right: 0;
    height: 50px;
  }
`;

function Header() {
  return <Logo src={logoImage} alt="Sophia Stel Logo"></Logo>;
}

export default Header;
