import { useState } from "react";
import { ChordIcon } from "@chord-ds/components";
import WeverseBottomNav from "../WeverseBottomNav";
import productThumb1 from "../../assets/figma/shop-order-form/product-thumb-1.png";
import productThumb2 from "../../assets/figma/shop-order-form/product-thumb-2.png";
import cardImage from "../../assets/figma/shop-order-form/card-image.png";
import cardImage2 from "../../assets/figma/shop-order-form/card-image-2.png";
import "./styles.css";

// Local composition — Header, TextButton, IconButton are screen-specific; no DS match in code-connect index.

const PRODUCT = {
  name: "SEVENTEEN OFFICIAL LIGHT STICK VER.3 10th Anniversary",
  option: "Set / 1개",
  price: "₩49,000",
  total: "₩49,000",
} as const;

const ORDERER = {
  name: "김위버",
  email: "kimwever@weversecompany.com",
  phone: "+82 01012345678",
} as const;

const CARDS = [
  { id: "bts", name: "위버스 신한카드 BTS", last4: "0613", type: "신용", installment: "일시불", img: cardImage },
  { id: "bts2", name: "위버스 신한카드 BTS", last4: "0613", type: "신용", installment: "일시불", img: cardImage2 },
] as const;

const TERMS = [
  "Toss 결제 시 문화비소득공제 신청이 불가하오니, 신용카드(국내발급) 결제수단을 선택하시어 결제를 진행해주세요.",
  "VISA/Master/JCB의 경우, 카드 청구서 상 'KRW*Eximbay로 표시됩니다.",
  "구매자가 미성년자인 경우 상품 구입 시 법정대리인이 동의하지 않은 경우, 미성년자 본인 또는 법정대리인이 구매 취소 할 수 있습니다.",
] as const;

type PaymentMethod = "weverse" | "general";

export default function ShopOrderForm() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("weverse");
  const [useAllCash, setUseAllCash] = useState(false);
  const [cashInput, setCashInput] = useState("");

  return (
    <div className="shopOrderForm">
      {/* GNB */}
      <header className="gnb">
        <button className="gnbBackBtn" aria-label="뒤로가기">
          <ChordIcon name="arrowLeftMedium" size={16} />
        </button>
        <h1 className="gnbTitle">주문서</h1>
        <div style={{ width: 36 }} />
      </header>

      {/* Body */}
      <div className="body">
        {/* 주문 상품 */}
        <section className="card productCard">
          <div className="sectionTitle">
            <span className="sectionTitleText">주문 상품</span>
            <ChordIcon name="arrowDownFoldMedium" size={16} />
          </div>
          <div className="productRow">
            <div className="thumbnail">
              <img src={productThumb1} alt="" />
              <img src={productThumb2} alt="" style={{ position: "absolute", inset: 0 }} />
            </div>
            <div className="productDetail">
              <span className="productName">{PRODUCT.name}</span>
              <span className="productOption">{PRODUCT.option}</span>
              <div className="priceRow">
                <span className="priceCurrency">KRW</span>
                <span className="priceAmount">{PRODUCT.price}</span>
              </div>
            </div>
          </div>
          <div className="totalRow">
            <span className="totalLabel">결제 금액</span>
            <div className="totalPriceRight">
              <span className="priceCurrency">KRW</span>
              <span className="priceAmount">{PRODUCT.total}</span>
            </div>
          </div>
        </section>

        {/* 주문자 */}
        <section className="card">
          <div className="sectionTitle">
            <span className="sectionTitleText">주문자</span>
            <ChordIcon name="arrowDownFoldMedium" size={16} />
          </div>
          <div className="ordererInfo">
            <div className="ordererText">
              <span className="ordererName">{ORDERER.name}</span>
              <span className="ordererEmail">{ORDERER.email}</span>
              <span className="ordererPhone">{ORDERER.phone}</span>
            </div>
            <button className="textBtn">변경</button>
          </div>
        </section>

        {/* PICK-UP 장소 */}
        <section className="card">
          <div className="sectionTitle">
            <span className="sectionTitleText">PICK-UP 장소</span>
          </div>
          <span className="pickupLocation">올림픽공원 B Zone</span>
        </section>

        {/* PICK-UP 예약 */}
        <section className="card">
          <div>
            <div className="pickupTitleRow">
              <span className="pickupTitleText">PICK-UP 예약</span>
              <ChordIcon name="questionMarkMedium" size={20} />
            </div>
            <span className="pickupDesc" style={{ marginTop: 8, display: "block" }}>
              상품을 픽업할 날짜와 시간을 선택해주세요.
            </span>
          </div>
          <button className="outlineBtn">PICK-UP 예약하기</button>
        </section>

        {/* 캐시 */}
        <section className="card">
          <div className="sectionTitle">
            <span className="sectionTitleText">캐시</span>
          </div>
          <div className="cashInputRow">
            <div className="cashTextField">
              <span>{cashInput || "KRW ₩0"}</span>
            </div>
            <button
              className="cashUseAllBtn"
              onClick={() => { setCashInput("49,000"); setUseAllCash(true); }}
            >
              전액 사용
            </button>
          </div>
          <div className="cashAvailableRow">
            <span className="cashAvailableLabel">보유</span>
            <div className="priceRow">
              <span className="priceCurrency">KRW</span>
              <span style={{ fontWeight: 500, color: "var(--cds-system-color-text-default)" }}>₩49,000</span>
            </div>
          </div>
          <label className="cashCheckRow">
            <div
              className={`checkCircle${useAllCash ? " checked" : ""}`}
              role="checkbox"
              aria-checked={useAllCash}
              onClick={() => setUseAllCash(v => !v)}
            />
            <span className="checkLabel">항상 전액 사용</span>
          </label>
        </section>

        {/* 결제 금액 */}
        <section className="card">
          <div className="sectionTitle">
            <span className="sectionTitleText">결제 금액</span>
            <ChordIcon name="arrowDownFoldMedium" size={16} />
          </div>
          <div className="priceBreakdown">
            <div className="subtotalRow">
              <span className="subtotalLabel">상품금액</span>
              <span className="subtotalPrice">KRW ₩48,000</span>
            </div>
            <div className="subtotalRow">
              <span className="subtotalLabel">세금</span>
              <span className="subtotalPrice">KRW ₩500</span>
            </div>
            <div className="subtotalRow">
              <span className="subtotalLabel">배송비</span>
              <span className="subtotalPrice">KRW ₩500</span>
            </div>
          </div>
          <div className="finalSection">
            <div className="finalRow">
              <span className="finalLabel">총 결제 금액</span>
              <div className="finalPriceRight">
                <span className="priceCurrency">KRW</span>
                <span className="priceAmount">₩49,000</span>
              </div>
            </div>
            <div className="cashRewardRow">
              <span className="cashRewardLabel">캐시 적립</span>
              <div className="cashRewardAmount">
                <span>KRW</span>
                <span>₩500</span>
              </div>
            </div>
          </div>
        </section>

        {/* 결제 수단 */}
        <section className="card">
          <div className="sectionTitle">
            <span className="sectionTitleText">결제 수단</span>
            <ChordIcon name="arrowDownFoldMedium" size={16} />
          </div>

          {/* 위버스 카드 */}
          <div>
            <div
              className="paymentOptionRow"
              onClick={() => setPaymentMethod("weverse")}
            >
              <div className={`radioBtn${paymentMethod === "weverse" ? " selected" : ""}`} />
              <span className={`paymentOptionLabel${paymentMethod === "weverse" ? " selected" : " unselected"}`}>
                위버스 카드
              </span>
            </div>
            {paymentMethod === "weverse" && (
              <>
                <div className="messageBox">
                  <span className="messageBoxText">최대 10% 캐시 적립 혜택</span>
                  <ChordIcon name="arrowRightMedium" size={12} />
                </div>
                <div className="cardCarousel" style={{ marginTop: 8 }}>
                  {CARDS.map((card, i) => (
                    <div key={card.id} className={`weverseCard${i === 0 ? " active" : " inactive"}`}>
                      <div className="cardImageWrap">
                        <img className="cardImg" src={card.img} alt={card.name} />
                      </div>
                      <div className="cardInfo">
                        <div className="cardNameRow">
                          <span className="cardName">{card.name}</span>
                          <ChordIcon name="favoritesMedium" size={20} />
                        </div>
                        <div className="cardDetailRow">
                          <span className="cardDetailText">{card.last4}</span>
                          <div className="cardDivider" />
                          <span className="cardDetailText">{card.type}</span>
                        </div>
                        <div className="installmentRow">
                          <span className="installmentText">{card.installment}</span>
                          <ChordIcon name="arrowDownMedium" size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 일반결제 */}
          <div
            className="paymentOptionRow"
            onClick={() => setPaymentMethod("general")}
          >
            <div className={`radioBtn${paymentMethod === "general" ? " selected" : ""}`} />
            <span className={`paymentOptionLabel${paymentMethod === "general" ? " selected" : " unselected"}`}>
              일반결제
            </span>
          </div>

          <div className="messageBox">
            <span className="messageBoxText">
              결제 수단은 배송 국가와 통화 유형에 따라 다를 수 있습니다.
            </span>
          </div>
        </section>

        {/* 유의사항 */}
        <section className="card">
          <div className="sectionTitle">
            <span className="sectionTitleText">유의사항</span>
            <ChordIcon name="arrowDownFoldMedium" size={16} />
          </div>
          <div className="termsContent">
            {TERMS.map((term, i) => (
              <p key={i} className="termItem">{term}</p>
            ))}
          </div>
        </section>

        {/* Scroll-to-top: in body so it scrolls with content */}
        <div className="floatingBtnRow">
          <button className="floatingBtn floatingBtn--up" aria-label="맨 위로">
            <ChordIcon name="arrowDownMedium" size={20} />
          </button>
        </div>
      </div>

      {/* Sticky bottom: pay bar + tab bar */}
      <footer className="bottom">
        <div className="bottomBar">
          <button className="payBtn">동의 후 KRW ₩52,000 결제</button>
          <div className="termsAgreement">
            <span className="termsArrow"><ChordIcon name="arrowDownFoldMedium" size={16} /></span>
            <p className="termsText">
              이용약관을 확인했으며, 개인정보 수집·이용 및 제공(해외 배송의 경우 국외제공)에 동의합니다.
            </p>
          </div>
        </div>
        <WeverseBottomNav />
      </footer>
    </div>
  );
}
