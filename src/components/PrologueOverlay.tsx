import React from 'react';

interface PrologueOverlayProps {
  onDismiss: () => void; // 버튼 클릭 시 호출될 콜백
}

const PrologueOverlay: React.FC<PrologueOverlayProps> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in"> {/* Slightly less opaque */}
      <div className="text-white text-center text-lg md:text-xl p-8 leading-relaxed max-w-2xl bg-gray-900 bg-opacity-80 rounded-lg shadow-xl relative border border-gray-700"> {/* Simpler shadow/border */}
        <p className="mb-6 text-gray-200"> {/* Lighter text for contrast */}
        대충 AI가 쓴 프롤로그 내용~<br />
        아득한 옛날, 숫자 세상은 완벽한 균형을 이루고 있었습니다.<br/>
        하지만 심술궂은 빌런이 나타나 숫자 세상의 질서를 무너뜨렸습니다.<br/>
        이제 당신이 흩어진 숫자들을 조합하여 숫자 세상을 구원해야 합니다!
        </p>
        <button
          onClick={onDismiss}
          className="btn-primary px-8 py-3 text-lg md:text-xl"
        >
          프롤로그 넘어가기 ➡️
        </button>
      </div>
    </div>
  );
};

export default PrologueOverlay;