export function canlendarStyles() {
    return (
        <style jsx global>
            {`
                .Cal__Day__root {
  display: inline-block;
  box-sizing: border-box;
  width: 14.28571%;
  list-style: none;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  user-select: none; }
  .Cal__Day__root.Cal__Day__enabled.Cal__Day__highlighted, .Cal__Day__root.Cal__Day__enabled:active, .Cal__Day__root.Cal__Day__enabled:hover {
    position: relative;
    z-index: 1; }
    .Cal__Day__root.Cal__Day__enabled.Cal__Day__highlighted:before, .Cal__Day__root.Cal__Day__enabled:active:before, .Cal__Day__root.Cal__Day__enabled:hover:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 52px;
      height: 52px;
      margin-top: -26px;
      margin-left: -26px;
      border-radius: 50%;
      background-color: #EFEFEF;
      z-index: -1; }
  .Cal__Day__root.Cal__Day__enabled:hover:before {
    opacity: 0.5; }
  .Cal__Day__root.Cal__Day__enabled.Cal__Day__highlighted:before, .Cal__Day__root.Cal__Day__enabled:active:before {
    opacity: 1; }
  .Cal__Day__root:first-child {
    position: relative; }
  .Cal__Day__root.Cal__Day__today {
    position: relative;
    z-index: 2; }
    .Cal__Day__root.Cal__Day__today > span {
      color: #3d3d3d; }
    .Cal__Day__root.Cal__Day__today.Cal__Day__disabled > span {
      color: #AAA; }
    .Cal__Day__root.Cal__Day__today:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 52px;
      height: 52px;
      margin-top: -26px;
      margin-left: -26px;
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px;
      z-index: -1; }
    .Cal__Day__root.Cal__Day__today.Cal__Day__disabled:before {
      box-shadow: inset 0 0 0 1px #BBB; }
  .Cal__Day__root.Cal__Day__selected {
    position: relative; }
    .Cal__Day__root.Cal__Day__selected > .Cal__Day__month, .Cal__Day__root.Cal__Day__selected > .Cal__Day__year {
      display: none; }
    .Cal__Day__root.Cal__Day__selected:before {
      display: none; }
    .Cal__Day__root.Cal__Day__selected .Cal__Day__selection {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 52px;
      height: 52px;
      margin-top: -26px;
      margin-left: -26px;
      border-radius: 50%;
      line-height: 56px;
      z-index: 2; }
      .Cal__Day__root.Cal__Day__selected .Cal__Day__selection .Cal__Day__month {
        top: 9px; }
      .Cal__Day__root.Cal__Day__selected .Cal__Day__selection .Cal__Day__day {
        position: relative;
        top: 5px;
        font-weight: bold;
        font-size: 18px; }
  .Cal__Day__root.Cal__Day__disabled {
    color: #AAA;
    cursor: not-allowed; }

.Cal__Day__month, .Cal__Day__year {
  position: absolute;
  left: 0;
  right: 0;
  font-size: 12px;
  line-height: 12px;
  text-transform: capitalize; }

.Cal__Day__month {
  top: 5px; }

.Cal__Day__year {
  bottom: 5px; }

/*
 * Range selection styles
 */
.Cal__Day__range.Cal__Day__selected.Cal__Day__start:after, .Cal__Day__range.Cal__Day__selected.Cal__Day__end:after {
  content: '';
  position: absolute;
  top: 50%;
  width: 50%;
  height: 52px;
  margin-top: -26px;
  box-shadow: inset 56px 56px; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__disabled .Cal__Day__selection.Cal__Day__selection {
  background-color: #EEE !important; }
  .Cal__Day__range.Cal__Day__selected.Cal__Day__disabled .Cal__Day__selection.Cal__Day__selection .Cal__Day__day, .Cal__Day__range.Cal__Day__selected.Cal__Day__disabled .Cal__Day__selection.Cal__Day__selection .Cal__Day__month {
    color: #AAA;
    font-weight: 300; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__start .Cal__Day__selection {
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__start:after {
  right: 0; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__start.Cal__Day__end:after {
  display: none; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__betweenRange .Cal__Day__selection {
  left: 0;
  right: 0;
  width: 100%;
  margin-left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__betweenRange .Cal__Day__day {
  top: 0;
  font-size: 16px; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__betweenRange .Cal__Day__month {
  display: none; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__end:after {
  left: 0; }

.Cal__Day__range.Cal__Day__selected.Cal__Day__end .Cal__Day__selection {
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  color: inherit !important;
  background-color: #FFF !important;
  border: 2px solid;
  box-sizing: border-box; }
  .Cal__Day__range.Cal__Day__selected.Cal__Day__end .Cal__Day__selection .Cal__Day__day {
    top: 4px; }
.Cal__Container__root {
  position: relative;
  display: table;
  z-index: 1;
  font: 14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.4em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 300;
  outline: none;
  text-align: left; }
  .Cal__Container__root.Cal__Container__landscape {
    display: flex;
    flex-direction: row; }
    .Cal__Container__root.Cal__Container__landscape .Cal__Container__wrapper {
      position: relative;
      flex-grow: 1;
      overflow: hidden;
      z-index: 1;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px; }

.Cal__Container__listWrapper {
  position: relative;
  overflow: hidden;
  background-color: #FFF; }
.Cal__Header__root {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
  min-height: 98px;
  padding: 20px;
  line-height: 1.3;
  font-weight: 400;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px; }
  .Cal__Header__root.Cal__Header__landscape {
    align-items: flex-start;
    min-width: 200px;
    border-top-right-radius: 0;
    border-bottom-left-radius: 3px; }
    .Cal__Header__root.Cal__Header__landscape .Cal__Header__dateWrapper.Cal__Header__day {
      flex-grow: 1;
      height: 76px; }

.Cal__Header__wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  cursor: pointer; }
  .Cal__Header__wrapper.Cal__Header__blank {
    height: 58px;
    line-height: 58px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 18px;
    cursor: default; }

.Cal__Header__dateWrapper {
  position: relative;
  display: block;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s ease; }
  .Cal__Header__dateWrapper.Cal__Header__active {
    color: white; }
  .Cal__Header__dateWrapper.Cal__Header__day {
    height: 38px;
    font-size: 36px;
    line-height: 36px;
    text-transform: capitalize; }
  .Cal__Header__dateWrapper.Cal__Header__year {
    height: 20px;
    font-size: 18px;
    line-height: 18px; }

.Cal__Header__date {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; }

.Cal__Header__range {
  display: flex;
  flex-grow: 1; }
  .Cal__Header__range .Cal__Header__dateWrapper {
    overflow: visible; }
  .Cal__Header__range .Cal__Header__wrapper:first-child:before, .Cal__Header__range .Cal__Header__wrapper:first-child:after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 0;
    margin-top: -50px;
    margin-left: -50px;
    border-top: 100px solid transparent;
    border-bottom: 100px solid transparent;
    border-left: 60px solid; }
  .Cal__Header__range .Cal__Header__wrapper:first-child:before {
    color: rgba(255, 255, 255, 0.15);
    transform: translateX(1px); }
  .Cal__Header__range .Cal__Header__wrapper:last-child {
    margin-left: 60px; }
  .Cal__Header__range .Cal__Header__wrapper .Cal__Header__date {
    white-space: nowrap;
    z-index: 1; }
.Cal__Today__root {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 6px;
  box-sizing: border-box;
  transform: translate3d(0, -100%, 0);
  font-weight: 500;
  line-height: 0;
  z-index: 10;
  cursor: pointer;
  transition: transform 0.3s ease;
  transition-delay: 0.3s; }
  .Cal__Today__root.Cal__Today__show {
    transform: translate3d(0, 0, 0);
    transition-delay: 0s; }
    .Cal__Today__root.Cal__Today__show .Cal__Today__chevron {
      transition: transform 0.3s ease; }
  .Cal__Today__root .Cal__Today__chevron {
    position: absolute;
    top: 50%;
    margin-top: -6px;
    margin-left: 5px;
    transform: rotate(270deg);
    transition: transform 0.3s ease; }
  .Cal__Today__root.Cal__Today__chevronUp .Cal__Today__chevron {
    transform: rotate(180deg); }
  .Cal__Today__root.Cal__Today__chevronDown .Cal__Today__chevron {
    transform: rotate(360deg); }
.Cal__MonthList__root {
  width: 100% !important;
  background-color: #FFF;
  -webkit-overflow-scrolling: touch; }
  .Cal__MonthList__root.Cal__MonthList__scrolling > div {
    pointer-events: none; }
  .Cal__MonthList__root.Cal__MonthList__scrolling label {
    opacity: 1; }
.Cal__Weekdays__root {
  position: relative;
  z-index: 5;
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
  box-shadow: inset 0 -1px rgba(0, 0, 0, 0.04); }

.Cal__Weekdays__day {
  padding: 15px 0;
  flex-basis: 14.28571%;
  flex-grow: 1;
  font-weight: 500;
  text-align: center; }
.Cal__Years__root {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F9F9F9; }
  .Cal__Years__root:before, .Cal__Years__root:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 50px;
    pointer-events: none;
    z-index: 1; }
  .Cal__Years__root:before {
    top: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%); }
  .Cal__Years__root:after {
    bottom: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%); }

.Cal__Years__list {
  box-sizing: border-box; }
  .Cal__Years__list.Cal__Years__center {
    display: flex;
    align-items: center;
    justify-content: center; }

.Cal__Years__year {
  display: flex;
  padding: 0 20px;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  -webkit-user-select: none;
  box-sizing: border-box; }
  .Cal__Years__year.Cal__Years__withMonths {
    border-bottom: 1px solid #E9E9E9; }
    .Cal__Years__year.Cal__Years__withMonths label {
      height: 88px;
      padding-top: 12px;
      box-sizing: border-box; }
  .Cal__Years__year label {
    flex-basis: 42%; }
    .Cal__Years__year label span {
      flex-shrink: 0;
      color: #333; }
  .Cal__Years__year ol {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    font-size: 14px; }
    .Cal__Years__year ol li {
      display: flex;
      width: 44px;
      height: 44px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      list-style: none;
      border-radius: 50%;
      box-sizing: border-box;
      color: #444;
      font-weight: 400;
      text-transform: capitalize; }
      .Cal__Years__year ol li.Cal__Years__currentMonth {
        border: 1px solid; }
      .Cal__Years__year ol li.Cal__Years__selected {
        position: relative;
        z-index: 1;
        background-color: blue;
        color: #FFF !important;
        border: 0; }
      .Cal__Years__year ol li.Cal__Years__disabled {
        cursor: not-allowed;
        color: #AAA; }
        .Cal__Years__year ol li.Cal__Years__disabled:hover {
          background-color: inherit; }
      .Cal__Years__year ol li:hover {
        background-color: #EFEFEF; }
  .Cal__Years__year:hover label > span, .Cal__Years__year.Cal__Years__active label > span {
    color: inherit; }
  .Cal__Years__year:hover, .Cal__Years__year.Cal__Years__active {
    position: relative;
    z-index: 2; }
  .Cal__Years__year.Cal__Years__active {
    font-size: 32px; }
  .Cal__Years__year.Cal__Years__currentYear {
    position: relative; }
    .Cal__Years__year.Cal__Years__currentYear label > span {
      min-width: 50px;
      padding-bottom: 5px;
      border-bottom: 3px solid; }
    .Cal__Years__year.Cal__Years__currentYear.Cal__Years__active label > span {
      min-width: 85px; }
  .Cal__Years__year.Cal__Years__first {
    padding-top: 40px; }
  .Cal__Years__year.Cal__Years__last {
    padding-bottom: 40px; }
.Cal__Animation__enter {
  opacity: 0;
  transform: translate3d(0, -100%, 0);
  transition: 0.25s ease; }

.Cal__Animation__enter.Cal__Animation__enterActive {
  opacity: 1;
  transform: translate3d(0, 0, 0); }

.Cal__Animation__leave {
  transform: translate3d(0, 0, 0);
  transition: 0.25s ease; }

.Cal__Animation__leave.Cal__Animation__leaveActive {
  opacity: 0;
  transform: translate3d(0, 100%, 0); }
.Cal__Slider__root, .Cal__Slider__slide {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; }

.Cal__Slider__root {
  overflow: hidden; }

.Cal__Slider__slide {
  padding: 20px 65px; }
  .Cal__Slider__slide:first-child {
    padding-left: 20px; }

.Cal__Slider__wrapper {
  height: 100%;
  transition: transform 0.3s ease; }

.Cal__Slider__arrow {
  position: absolute;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
  opacity: 0.7;
  cursor: pointer;
  border-left: 1px solid rgba(255, 255, 255, 0.1); }
  .Cal__Slider__arrow svg {
    width: 15px; }
  .Cal__Slider__arrow:hover {
    opacity: 1; }

.Cal__Slider__arrowRight {
  right: 0; }

.Cal__Slider__arrowLeft {
  left: 0;
  transform: scaleX(-1); }
.Cal__transition__enter {
  opacity: 0; }

.Cal__transition__enterActive {
  opacity: 1;
  transition: opacity 0.3s ease; }

.Cal__transition__leave {
  opacity: 1; }

.Cal__transition__leaveActive {
  opacity: 0;
  transition: opacity 0.3s ease; }
.Cal__Month__rows {
  position: relative;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.05) 100%); }

.Cal__Month__row {
  padding: 0;
  margin: 0; }
  .Cal__Month__row:first-child {
    text-align: right; }
    .Cal__Month__row:first-child li {
      background-color: #FFF;
      box-shadow: 0 -1px 0 #E9E9E9; }
  .Cal__Month__row:nth-child(2) {
    box-shadow: 0 -1px 0 #E9E9E9; }
  .Cal__Month__row.Cal__Month__partial:first-child li:first-child {
    box-shadow: 0px -1px 0 #E9E9E9, inset 1px 0 0 #E9E9E9; }
  .Cal__Month__row.Cal__Month__partial:last-of-type li {
    position: relative;
    z-index: 1; }

.Cal__Month__label {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  font-size: 30px;
  font-weight: 500;
  z-index: 3;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  transition: opacity 0.3s ease; }
  .Cal__Month__label > span {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: capitalize; }
  .Cal__Month__label.Cal__Month__partialFirstRow {
    top: 56px; }

            `}
        </style>
    )
}
export default canlendarStyles;
