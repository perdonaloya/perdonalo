"use client"

interface Props {
  para: string
  de: string
  mensaje: string
}

export default function BuenosDias({ para, de, mensaje }: Props) {
  const msgFs = mensaje.length <= 100 ? "1rem" : mensaje.length <= 180 ? "0.875rem" : "0.75rem";
  const msgLh = mensaje.length <= 180 ? "1.7" : "1.3";
  return (
    <div className="scene">

      {/* VIDEO DE FONDO */}
      <video
        className="bg-video"
        src="/morning-landscape.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* CARTA */}
      <div className="card">

        <div className="emoji">☀️</div>

        <p className="title">
          Buenos días, {para}
        </p>

        <p className="msg" style={{ fontSize: msgFs, lineHeight: msgLh }}>
          &ldquo;{mensaje}&rdquo;
        </p>

        <p className="firma">
          — {de}
        </p>

      </div>

<style>{`

.scene{
min-height:100vh;
position:relative;
overflow:hidden;
background:#f5e8c0;
}

.bg-video{
position:absolute;
inset:0;
width:100%;
height:100%;
object-fit:cover;
z-index:0;
}

.card{
position:absolute;
top:50%;
left:50%;
transform:translate(-50%,-50%);
width:90%;
max-width:360px;
padding:32px;
border-radius:28px;
background:linear-gradient(135deg,rgba(255,252,245,.45),rgba(255,245,225,.35));
backdrop-filter:blur(12px);
box-shadow:0 10px 40px rgba(0,0,0,.2);
z-index:1;
text-align:center;
}

.emoji{
font-size:28px;
margin-bottom:10px;
}

.title{
font-size:12px;
letter-spacing:.2em;
text-transform:uppercase;
font-weight:bold;
color:#92400e;
}

.msg{
margin-top:12px;
font-style:italic;
line-height:1.5;
}

.firma{
margin-top:16px;
color:#92400e;
}

`}</style>

    </div>
  )
}
