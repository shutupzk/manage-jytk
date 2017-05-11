import styled from 'styled-components'

const Wrapper = styled.li`
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  position: relative;
  border-top: 1px solid #eee;

  &:first-child {
    border-top: none;
  }
  margin-top:8px;
  
  &:first-child {
    margin-top: 0px;
  }
  // margin-bottom:4px;
`

export default Wrapper