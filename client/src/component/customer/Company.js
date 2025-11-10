import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faLocationDot, faPhone, faFax, faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect } from "react";
import axios from "axios";

import "../../style/company.css";

const {kakao} = window;


function Company() {

    useEffect(() => {
    // 카카오맵 스크립트 동적 로드
    const script = document.createElement("script");
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=4d2b6a0384635785e2e1d29095377144&autoload=false";
    script.async = true;

    script.onload = () => {
      // 스크립트 로드 후 카카오맵 초기화
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.556359, 126.937202), // 중심 좌표
          level: 3, // 확대 레벨
        };

        const map = new window.kakao.maps.Map(container, options);

        // 마커 표시
        const markerPosition = new window.kakao.maps.LatLng(37.556359, 126.937202);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 인포윈도우 표시
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding:5px;font-size:14px;color:black;">
              오늘뭐보지?<br/><br/>
              <a href="https://map.kakao.com/link/to/오늘뭐보지,37.556359,126.937202" target="_blank">
                길찾기
              </a>
            </div>
          `,
        });
        infowindow.open(map, marker);

        // 확대/축소 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
  <div className="main-container">
      <h2 className="section-title">회사소개</h2>

      <div className="company-wrapper">
        <div id="map" className="company-map"></div>

        {/* 텍스트 영역 */}
        <div className="company-info">
          {/* 주소 */}
          <div className="info-row">
            <FontAwesomeIcon icon={faLocationDot} className="info-icon" />
            <span className="info-label">주소</span>
            <span className="info-value">
              서울특별시 서대문구 연세로 8-1 버티고타워 7층
            </span>
          </div>

          {/* 전화 */}
          <div className="info-row">
            <FontAwesomeIcon icon={faPhone} className="info-icon" />
            <span className="info-label">전화</span>
            <span className="info-value">031-1234-1234</span>
          </div>

          {/* 팩스 */}
          <div className="info-row">
            <FontAwesomeIcon icon={faFax} className="info-icon" />
            <span className="info-label">팩스</span>
            <span className="info-value">031-1234-0000</span>
          </div>

          {/* 이메일 */}
          <div className="info-row">
            <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
            <span className="info-label">이메일</span>
            <span className="info-value">tv_mwoboji@mwoboji.co.kr</span>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Company