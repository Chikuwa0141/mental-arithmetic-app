'use client'; //これはクライアントコンポーネントですよー

import{ useState } from "react";

export default function PracticePage() {
    const[count, setCount] = useState(0); //カウントの状態を管理するためのuseStateフック
    const [clicked, setclicked] = useState(false); //"分割代入"　クリックされたかどうかの状態を管理するためのuseStateフック const[変数名,変数を更新する関数名]=usestate(初期値);
    return (
        <main className="p-8">
            <h1 className="text-4xl font-bold mb-4">Hello World</h1>
            <p className="text-2xl font-semibold mb-2 ml-4">Using App Router</p>
            <p className="text-base text-gray-700 mb-6">これはTailwind CSSを使っています</p>

            {/*カウントアップボタン*/}
            <button
                onClick={() =>{
                    setclicked(true); //クリックされたらclickedをtrueにする
                    setCount(count + 1); //クリックされたらカウントを1増やす
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
                クリックしてみて
            </button>

            {/*カウントダウンボタン*/}
            <button
                onClick={() =>{
                    setCount(0) //クリックされたらカウントを0にする
                    setclicked(false); //クリックされたらclickedをfalseにする
                }}
                className="bg-blue-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full ml-4">
                リセット
            </button>
            
            {clicked && <p className = "text-green-600 font-semibold">クリックされた！</p>} {/*{条件 && 表示するもの}*/}
            <p className="text-xl mb-4">クリックされた回数:<span className= "font-bold">{count}</span></p>
        </main>
    );
}