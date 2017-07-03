import React, { Component, PropTypes } from 'react';
import theme from '../theme.js';

/**
 * component: FilterCard
 * @param {*} props 
 */
export function FilterCard(props) {
	return (
		<div>
			<div className='filterCard flex tb-flex'>
				{props.children}
				{/*<FilterSelect />*/}
				{/*<FilterTime />*/}
			</div>
			<style jsx>{`
				.filterCard {
					background: ${theme.maincolor};
					{/*justify-content: space-between;*/}
				}
			`}</style>
		</div>
	);
}
FilterCard.propTypes = {
  children: PropTypes.array
}


/**
 * component: FilterSelect
 * @param {*data\onselect} 
 */
export function FilterSelect(props) {
	const patientArr = props.patientArr || [];
	return (
		<div className='select' style={{margin: '.1rem 0 .1rem .15rem'}}>
			<select onChange={(e) => {props.changePatientSelect(e)}}>
				{
					patientArr.map((patient) => {
						return (
							<option key={patient.id} value={patient.id}>
								{patient.name}
							</option>
						)
					})
				}
			</select>
		</div>
	)
}


/**
 * component: FilterTime
 * @param {*clickShowModal} 
 */
export function FilterTime(props) {
	return (
		<div className='filterTime' onClick={() => {props.clickShowFilterModal()}}>
			<img src={`/static/icons/sosouIcon.png`} alt='' />
			<style jsx>{`
				.filterTime{
					padding: .1rem .2rem;
				}
				.filterTime img{
					height: .2rem;
				}
			`}</style>
		</div>
	)
}
