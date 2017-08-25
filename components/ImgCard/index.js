import React, { Component, PropTypes } from 'react';
import {theme} from 'components';
import { connect } from 'react-redux'
import {getQiniuUpToken, showPrompt, selectImgFiles, changeImgBase64} from '/ducks'

class ImgCard extends Component {
  constructor (props) {
		super(props)
    this.state = {
    }
	}


	// 修改图片路径
  clickDescribeAddImg(event) {
    const asd = event.target.value;
    const imageFiles = event.target.files;
		this.props.selectImgFiles({imageFiles})
    const curComponent = this;
    for (let ii = 0; ii < imageFiles.length; ii++){
      this.processfile(imageFiles[ii], ii, curComponent);
    }
  }

  // 将图片转为base64
  processfile(file, key, curComponent) {
		this.props.getQiniuUpToken({key: file.name})
    const reader = new FileReader();
    reader.onload = function readerLoad(event) {
      const blob = new Blob([event.target.result]);
      window.URL = window.URL || window.webkitURL;
      const blobURL = window.URL.createObjectURL(blob);
      const image = new Image();
      image.src = blobURL;
      image.onload = function imgOnload() {
				const imgBase64 = curComponent.resizeMe(image);
				curComponent.props.changeImgBase64({imgBase64});
      };
    };
    reader.readAsArrayBuffer(file);
  }

  // 压缩图片
  resizeMe(img) {
		const canvas = document.createElement('canvas');
		let width = img.width;
		let height = img.height;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    //  压缩率
    return canvas.toDataURL('image/jpeg', 0.7);
	}
	
	render() {
		const doctorImg = this.props.imgBase64 || this.props.avatar || '/static/icons/doctor_normal_header.png';
		return (
			<div>
				<label htmlFor='addImg' style={{ height: 50, width: 50, backgroundImage: `url(${doctorImg})`, backgroundSize: 46, display: 'block'}}></label>
					<input type="file" accept="image/*" id="addImg" style={{display: 'none'}}
              onChange={(e) => this.clickDescribeAddImg(e)} />
			</div>
		);
	}
}

function mapStateToProps (state) {
  return {
    upTokens: state.qiniu.upTokens,
    loading: state.qiniu.loading,
		error: state.qiniu.error,
		imgBase64: state.qiniu.imgBase64
  }
}

export default connect(mapStateToProps, { showPrompt, getQiniuUpToken, selectImgFiles, changeImgBase64 })(ImgCard)

