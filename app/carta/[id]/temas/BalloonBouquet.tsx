export default function BalloonBouquet({ className }: { className?: string }) {
  return (
    <svg width="100%" viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg" className={className}>
      <style>{`
        @keyframes f1{0%,100%{transform:translate(0,0)}25%{transform:translate(2px,-3px)}50%{transform:translate(-1px,-5px)}75%{transform:translate(3px,-2px)}}
        @keyframes f2{0%,100%{transform:translate(0,0)}25%{transform:translate(-3px,-2px)}50%{transform:translate(2px,-4px)}75%{transform:translate(-2px,-3px)}}
        @keyframes f3{0%,100%{transform:translate(0,0)}25%{transform:translate(1px,-4px)}50%{transform:translate(-2px,-6px)}75%{transform:translate(2px,-3px)}}
        @keyframes f4{0%,100%{transform:translate(0,0)}25%{transform:translate(-2px,-3px)}50%{transform:translate(3px,-5px)}75%{transform:translate(-1px,-2px)}}
        @keyframes f5{0%,100%{transform:translate(0,0)}25%{transform:translate(3px,-2px)}50%{transform:translate(-3px,-4px)}75%{transform:translate(1px,-6px)}}
        @keyframes f6{0%,100%{transform:translate(0,0)}25%{transform:translate(-1px,-5px)}50%{transform:translate(2px,-3px)}75%{transform:translate(-3px,-4px)}}
        @keyframes f7{0%,100%{transform:translate(0,0)}25%{transform:translate(2px,-4px)}50%{transform:translate(-2px,-2px)}75%{transform:translate(3px,-5px)}}
        @keyframes f8{0%,100%{transform:translate(0,0)}25%{transform:translate(-3px,-3px)}50%{transform:translate(1px,-5px)}75%{transform:translate(-2px,-2px)}}
        @keyframes curl1{0%,100%{transform:rotate(0deg)}50%{transform:rotate(3deg)}}
        @keyframes curl2{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-3deg)}}
        @keyframes curl3{0%,100%{transform:rotate(0deg)}33%{transform:rotate(2deg)}66%{transform:rotate(-2deg)}}
        @keyframes sway1{0%,100%{transform:rotate(0deg)}50%{transform:rotate(1.5deg)}}
        @keyframes sway2{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-1.5deg)}}
        .b1{animation:f1 4.2s ease-in-out infinite}.b2{animation:f2 3.8s ease-in-out infinite}.b3{animation:f3 4.5s ease-in-out infinite}.b4{animation:f4 3.6s ease-in-out infinite}.b5{animation:f5 4.0s ease-in-out infinite}.b6{animation:f6 4.8s ease-in-out infinite}.b7{animation:f7 3.9s ease-in-out infinite}.b8{animation:f8 4.3s ease-in-out infinite}
        .c1{animation:curl1 3.0s ease-in-out infinite;transform-origin:top center}.c2{animation:curl2 3.5s ease-in-out infinite;transform-origin:top center}.c3{animation:curl3 2.8s ease-in-out infinite;transform-origin:top center}
        .sw1{animation:sway1 5s ease-in-out infinite;transform-origin:340px 430px}.sw2{animation:sway2 4.5s ease-in-out infinite;transform-origin:340px 430px}
      `}</style>
      <defs>
        <radialGradient id="gp1" cx="0.38" cy="0.30" r="0.56"><stop offset="0%" stopColor="#F7EDBA"/><stop offset="30%" stopColor="#EDDFA0"/><stop offset="60%" stopColor="#DFD088"/><stop offset="85%" stopColor="#CEBF70"/><stop offset="100%" stopColor="#C0B060"/></radialGradient>
        <radialGradient id="gp2" cx="0.35" cy="0.28" r="0.58"><stop offset="0%" stopColor="#FAF1C5"/><stop offset="28%" stopColor="#EFE3A8"/><stop offset="55%" stopColor="#E0D28E"/><stop offset="82%" stopColor="#D0C278"/><stop offset="100%" stopColor="#C2B365"/></radialGradient>
        <radialGradient id="gp3" cx="0.40" cy="0.32" r="0.52"><stop offset="0%" stopColor="#F5EAB2"/><stop offset="32%" stopColor="#EADC98"/><stop offset="58%" stopColor="#DCCC82"/><stop offset="84%" stopColor="#CCBC6C"/><stop offset="100%" stopColor="#BEAE5C"/></radialGradient>
        <radialGradient id="gp4" cx="0.33" cy="0.26" r="0.60"><stop offset="0%" stopColor="#FCF4CE"/><stop offset="25%" stopColor="#F0E5AD"/><stop offset="52%" stopColor="#E2D594"/><stop offset="80%" stopColor="#D2C57E"/><stop offset="100%" stopColor="#C4B66A"/></radialGradient>
        <radialGradient id="s1" cx="0.36" cy="0.29" r="0.56"><stop offset="0%" stopColor="#FFFEF8"/><stop offset="18%" stopColor="#F8F3E6"/><stop offset="42%" stopColor="#EFE9D5"/><stop offset="68%" stopColor="#E4DCC6"/><stop offset="88%" stopColor="#D9D0B8"/><stop offset="100%" stopColor="#CFC5AB"/></radialGradient>
        <radialGradient id="s2" cx="0.40" cy="0.31" r="0.53"><stop offset="0%" stopColor="#FFFEF6"/><stop offset="20%" stopColor="#F6F0E0"/><stop offset="45%" stopColor="#EDE5D0"/><stop offset="70%" stopColor="#E2D9C0"/><stop offset="90%" stopColor="#D6CDB4"/><stop offset="100%" stopColor="#CCC2A8"/></radialGradient>
        <radialGradient id="s3" cx="0.34" cy="0.27" r="0.58"><stop offset="0%" stopColor="#FFFDF5"/><stop offset="16%" stopColor="#FAF5EA"/><stop offset="40%" stopColor="#F0EADA"/><stop offset="65%" stopColor="#E6DFCA"/><stop offset="86%" stopColor="#DBD3BC"/><stop offset="100%" stopColor="#D0C8AE"/></radialGradient>
        <radialGradient id="s4" cx="0.42" cy="0.33" r="0.50"><stop offset="0%" stopColor="#FFFEFA"/><stop offset="22%" stopColor="#F5EFE2"/><stop offset="48%" stopColor="#ECE4D2"/><stop offset="72%" stopColor="#E0D8C2"/><stop offset="92%" stopColor="#D4CCB6"/><stop offset="100%" stopColor="#CAC0A6"/></radialGradient>
      </defs>

      {/* Cuerdas */}
      <g fill="none" stroke="#C8B870" strokeWidth="0.8" opacity="0.50">
        <g className="sw1">
          <path d="M185 200 Q200 340 340 430"/><path d="M200 262 Q218 360 340 430"/><path d="M218 158 Q232 330 340 430"/><path d="M282 138 Q295 320 340 430"/><path d="M195 205 Q212 345 340 430"/><path d="M255 178 Q268 335 340 430"/><path d="M175 232 Q192 355 340 430"/><path d="M230 220 Q248 350 340 430"/><path d="M205 270 Q225 370 340 430"/><path d="M262 260 Q280 370 340 430"/><path d="M172 298 Q200 385 340 430"/><path d="M222 302 Q250 385 340 430"/><path d="M282 298 Q305 385 340 430"/><path d="M195 330 Q228 395 340 430"/><path d="M255 332 Q280 395 340 430"/><path d="M158 242 Q178 365 340 430"/><path d="M300 335 Q315 398 340 430"/><path d="M312 132 Q318 325 340 430"/>
        </g>
        <g className="sw2">
          <path d="M495 198 Q488 340 340 430"/><path d="M478 260 Q468 360 340 430"/><path d="M455 158 Q445 330 340 430"/><path d="M400 135 Q398 320 340 430"/><path d="M482 202 Q472 345 340 430"/><path d="M418 175 Q415 335 340 430"/><path d="M505 232 Q492 355 340 430"/><path d="M448 220 Q438 350 340 430"/><path d="M475 268 Q460 370 340 430"/><path d="M415 258 Q408 370 340 430"/><path d="M490 298 Q475 385 340 430"/><path d="M432 298 Q422 385 340 430"/><path d="M542 262 Q510 380 340 430"/><path d="M395 330 Q390 395 340 430"/><path d="M455 328 Q442 395 340 430"/><path d="M515 310 Q492 390 340 430"/><path d="M530 238 Q505 365 340 430"/><path d="M370 130 Q365 325 340 430"/>
        </g>
        <path d="M342 128 Q342 320 340 430"/><path d="M340 175 Q340 335 340 430"/><path d="M305 212 Q318 360 340 430"/><path d="M375 210 Q372 360 340 430"/><path d="M340 255 Q340 375 340 430"/><path d="M362 300 Q358 390 340 430"/><path d="M340 335 Q340 400 340 430"/>
      </g>

      {/* Cintas rizadas */}
      <g fill="none" strokeLinecap="round">
        <g className="c1"><path d="M195 340 C200 343 202 345 197 348 C192 351 190 353 195 356 C200 359 202 361 197 364 C192 367 190 369 195 372 C200 375 202 377 197 380 C192 383 190 385 195 388 C200 391 202 393 197 396 C192 399 191 401 194 403" stroke="#D4C87A" strokeWidth="0.7" opacity="0.55"/></g>
        <g className="c2"><path d="M340 342 C345 345 347 347 342 350 C337 353 335 355 340 358 C345 361 347 363 342 366 C337 369 335 371 340 374 C345 377 347 379 342 382 C337 385 335 387 340 390 C345 393 347 395 342 398 C337 401 336 403 339 405" stroke="#C8B870" strokeWidth="0.7" opacity="0.50"/></g>
        <g className="c3"><path d="M455 338 C460 341 462 343 457 346 C452 349 450 351 455 354 C460 357 462 359 457 362 C452 365 450 367 455 370 C460 373 462 375 457 378 C452 381 450 383 455 386 C460 389 462 391 457 394 C452 397 451 399 454 401" stroke="#D0C078" strokeWidth="0.7" opacity="0.52"/></g>
        <g className="c1"><path d="M222 315 C227 318 229 320 224 323 C219 326 217 328 222 331 C227 334 229 336 224 339 C219 342 217 344 222 347 C227 350 229 352 224 355 C219 358 218 360 221 362" stroke="#CDBE68" strokeWidth="0.6" opacity="0.50"/></g>
        <g className="c2"><path d="M395 312 C400 315 402 317 397 320 C392 323 390 325 395 328 C400 331 402 333 397 336 C392 339 390 341 395 344 C400 347 402 349 397 352 C392 355 391 357 394 359" stroke="#C8B870" strokeWidth="0.6" opacity="0.48"/></g>
        <g className="c3"><path d="M515 318 C520 321 522 323 517 326 C512 329 510 331 515 334 C520 337 522 339 517 342 C512 345 510 347 515 350 C520 353 522 355 517 358 C512 361 511 363 514 365" stroke="#D4C87A" strokeWidth="0.6" opacity="0.45"/></g>
        <g className="c1"><path d="M260 342 C265 345 267 347 262 350 C257 353 255 355 260 358 C265 361 267 363 262 366 C257 369 255 371 260 374 C265 377 267 379 263 381" stroke="#D0C078" strokeWidth="0.6" opacity="0.48"/></g>
        <g className="c2"><path d="M172 308 C177 311 179 313 174 316 C169 319 167 321 172 324 C177 327 179 329 174 332 C169 335 167 337 172 340 C177 343 179 345 175 347" stroke="#C8B870" strokeWidth="0.6" opacity="0.42"/></g>
        <g className="c3"><path d="M300 345 C305 348 307 350 302 353 C297 356 295 358 300 361 C305 364 307 366 302 369 C297 372 295 374 300 377 C305 380 307 382 303 384" stroke="#D4C87A" strokeWidth="0.6" opacity="0.46"/></g>
      </g>

      {/* Nudo */}
      <ellipse cx="340" cy="430" rx="3.5" ry="2.5" fill="#C8B870" opacity="0.7"/>
      <line x1="340" y1="432" x2="340" y2="455" stroke="#C8B870" strokeWidth="1.2" opacity="0.5"/>

      {/* Globos fila trasera (laterales pequeños) */}
      <g className="b3"><ellipse cx="195" cy="172" rx="27" ry="29" fill="url(#gp2)" opacity="0.65"/></g>
      <g className="b5"><ellipse cx="485" cy="168" rx="26" ry="28" fill="url(#s2)" opacity="0.65"/></g>
      <g className="b7"><ellipse cx="208" cy="232" rx="28" ry="30" fill="url(#s3)" opacity="0.62"/></g>
      <g className="b1"><ellipse cx="472" cy="228" rx="27" ry="29" fill="url(#gp3)" opacity="0.62"/></g>

      {/* Fila 1 - muy atrás, arriba */}
      <g className="b2"><ellipse cx="222" cy="128" rx="29" ry="31" fill="url(#s1)" opacity="0.72"/></g>
      <g className="b6"><ellipse cx="285" cy="108" rx="30" ry="32" fill="url(#gp1)" opacity="0.74"/></g>
      <g className="b4"><ellipse cx="342" cy="98" rx="30" ry="32" fill="url(#s4)" opacity="0.76"/></g>
      <g className="b8"><ellipse cx="398" cy="105" rx="30" ry="32" fill="url(#gp4)" opacity="0.74"/></g>
      <g className="b3"><ellipse cx="452" cy="125" rx="29" ry="31" fill="url(#s2)" opacity="0.72"/></g>

      {/* Fila 2 */}
      <g className="b5"><ellipse cx="200" cy="180" rx="31" ry="33" fill="url(#gp3)"/></g>
      <g className="b1"><ellipse cx="258" cy="153" rx="32" ry="34" fill="url(#gp2)"/></g>
      <g className="b7"><ellipse cx="340" cy="142" rx="33" ry="35" fill="url(#gp4)"/></g>
      <g className="b3"><ellipse cx="418" cy="148" rx="32" ry="34" fill="url(#s1)"/></g>
      <g className="b6"><ellipse cx="480" cy="178" rx="31" ry="33" fill="url(#gp1)"/></g>
      <g className="b6"><ellipse cx="312" cy="128" rx="24" ry="26" fill="url(#gp3)" opacity="0.82"/></g>
      <g className="b2"><ellipse cx="370" cy="126" rx="24" ry="26" fill="url(#s2)" opacity="0.82"/></g>

      {/* Fila 3 */}
      <g className="b8"><ellipse cx="178" cy="210" rx="33" ry="35" fill="url(#gp1)" opacity="0.88"/></g>
      <g className="b2"><ellipse cx="232" cy="195" rx="34" ry="36" fill="url(#s2)"/></g>
      <g className="b4"><ellipse cx="308" cy="188" rx="35" ry="37" fill="url(#gp3)"/></g>
      <g className="b6"><ellipse cx="375" cy="186" rx="35" ry="37" fill="url(#s3)"/></g>
      <g className="b1"><ellipse cx="448" cy="193" rx="34" ry="36" fill="url(#gp2)"/></g>
      <g className="b5"><ellipse cx="505" cy="208" rx="33" ry="35" fill="url(#s1)" opacity="0.88"/></g>

      {/* Fila 4 */}
      <g className="b3"><ellipse cx="205" cy="248" rx="35" ry="37" fill="url(#s4)"/></g>
      <g className="b7"><ellipse cx="265" cy="233" rx="36" ry="38" fill="url(#gp4)"/></g>
      <g className="b1"><ellipse cx="340" cy="226" rx="37" ry="39" fill="url(#s1)"/></g>
      <g className="b5"><ellipse cx="415" cy="230" rx="36" ry="38" fill="url(#gp1)"/></g>
      <g className="b2"><ellipse cx="478" cy="246" rx="35" ry="37" fill="url(#s3)"/></g>

      {/* Globos laterales acento */}
      <g className="b4"><ellipse cx="162" cy="245" rx="20" ry="22" fill="url(#gp2)" opacity="0.55"/><polygon points="160,267 162,271 164,267" fill="#C8B870" opacity="0.40"/></g>
      <g className="b8"><ellipse cx="530" cy="238" rx="20" ry="22" fill="url(#s3)" opacity="0.55"/><polygon points="528,260 530,264 532,260" fill="#C8B870" opacity="0.40"/></g>

      {/* Fila 5 */}
      <g className="b6"><ellipse cx="172" cy="282" rx="33" ry="35" fill="url(#s1)" opacity="0.82"/></g>
      <g className="b2"><ellipse cx="222" cy="272" rx="36" ry="38" fill="url(#gp2)"/></g>
      <g className="b8"><ellipse cx="285" cy="266" rx="37" ry="39" fill="url(#s2)"/></g>
      <g className="b4"><ellipse cx="362" cy="264" rx="38" ry="40" fill="url(#gp3)"/></g>
      <g className="b7"><ellipse cx="435" cy="268" rx="37" ry="39" fill="url(#s4)"/></g>
      <g className="b1"><ellipse cx="495" cy="278" rx="35" ry="37" fill="url(#gp4)" opacity="0.85"/></g>
      <g className="b5"><ellipse cx="545" cy="272" rx="33" ry="35" fill="url(#s2)" opacity="0.82"/></g>

      {/* Fila 6 */}
      <g className="b3"><ellipse cx="195" cy="308" rx="35" ry="37" fill="url(#gp4)" opacity="0.78"/></g>
      <g className="b7"><ellipse cx="258" cy="300" rx="37" ry="39" fill="url(#gp1)" opacity="0.80"/></g>
      <g className="b4"><ellipse cx="300" cy="298" rx="35" ry="37" fill="url(#s4)" opacity="0.80"/></g>
      <g className="b5"><ellipse cx="340" cy="297" rx="38" ry="40" fill="url(#s3)" opacity="0.82"/></g>
      <g className="b1"><ellipse cx="395" cy="300" rx="37" ry="39" fill="url(#gp4)" opacity="0.80"/></g>
      <g className="b6"><ellipse cx="455" cy="296" rx="35" ry="37" fill="url(#s1)" opacity="0.75"/></g>
      <g className="b2"><ellipse cx="515" cy="305" rx="35" ry="37" fill="url(#gp2)" opacity="0.78"/></g>

      {/* Nudos de globos */}
      <g fill="#C8B870" opacity="0.55">
        <polygon points="193,201 195,207 197,201"/><polygon points="483,196 485,202 487,196"/><polygon points="206,262 208,268 210,262"/><polygon points="470,257 472,263 474,257"/>
        <polygon points="220,159 222,165 224,159"/><polygon points="283,140 285,146 287,140"/><polygon points="340,130 342,136 344,130"/><polygon points="396,137 398,143 400,137"/><polygon points="450,156 452,162 454,156"/>
        <polygon points="198,213 200,219 202,213"/><polygon points="256,187 258,193 260,187"/><polygon points="338,177 340,183 342,177"/><polygon points="416,182 418,188 420,182"/><polygon points="478,211 480,217 482,211"/>
        <polygon points="176,247 178,253 180,247"/><polygon points="230,233 232,239 234,233"/><polygon points="306,227 308,233 310,227"/><polygon points="373,225 375,231 377,225"/><polygon points="446,231 448,237 450,231"/><polygon points="503,245 505,251 507,245"/>
        <polygon points="203,287 205,293 207,287"/><polygon points="263,275 265,281 267,275"/><polygon points="338,270 340,276 342,270"/><polygon points="413,273 415,279 417,273"/><polygon points="476,286 478,292 480,286"/>
        <polygon points="170,317 172,323 174,317"/><polygon points="220,310 222,316 224,310"/><polygon points="283,305 285,311 287,305"/><polygon points="360,304 362,310 364,304"/><polygon points="433,307 435,313 437,307"/><polygon points="493,315 495,321 497,315"/><polygon points="543,307 545,313 547,307"/>
        <polygon points="193,345 195,351 197,345"/><polygon points="256,339 258,345 260,339"/><polygon points="298,335 300,341 302,335"/><polygon points="338,337 340,343 342,337"/><polygon points="393,339 395,345 397,339"/><polygon points="453,333 455,339 457,333"/><polygon points="513,342 515,348 517,342"/>
        <polygon points="310,154 312,160 314,154"/><polygon points="368,152 370,158 372,152"/>
      </g>

      {/* Brillos secundarios */}
      <g opacity="0.20">
        <ellipse cx="250" cy="143" rx="7" ry="9" fill="#FFF8D8" transform="rotate(-20 250 143)"/>
        <ellipse cx="332" cy="132" rx="7" ry="9" fill="#FFF8D8" transform="rotate(-15 332 132)"/>
        <ellipse cx="300" cy="178" rx="8" ry="10" fill="#FFF8D8" transform="rotate(-18 300 178)"/>
        <ellipse cx="440" cy="183" rx="8" ry="10" fill="#FFF8D8" transform="rotate(-22 440 183)"/>
        <ellipse cx="258" cy="224" rx="9" ry="11" fill="#FFF8D8" transform="rotate(-20 258 224)"/>
        <ellipse cx="408" cy="222" rx="9" ry="11" fill="#FFF8D8" transform="rotate(-16 408 222)"/>
        <ellipse cx="278" cy="258" rx="9" ry="11" fill="#FFF8D8" transform="rotate(-22 278 258)"/>
        <ellipse cx="355" cy="256" rx="9" ry="11" fill="#FFF8D8" transform="rotate(-18 355 256)"/>
        <ellipse cx="250" cy="292" rx="9" ry="11" fill="#FFF8D8" transform="rotate(-20 250 292)"/>
        <ellipse cx="388" cy="292" rx="9" ry="11" fill="#FFF8D8" transform="rotate(-15 388 292)"/>
        <ellipse cx="192" cy="170" rx="6" ry="8" fill="#FFF8D8" transform="rotate(-18 192 170)"/>
        <ellipse cx="475" cy="168" rx="6" ry="8" fill="#FFF8D8" transform="rotate(-22 475 168)"/>
        <ellipse cx="278" cy="100" rx="6" ry="8" fill="#FFF8D8" transform="rotate(-20 278 100)"/>
        <ellipse cx="391" cy="97" rx="6" ry="8" fill="#FFF8D8" transform="rotate(-16 391 97)"/>
        <ellipse cx="507" cy="298" rx="9" ry="11" fill="#FFF8D8" transform="rotate(-18 507 298)"/>
        <ellipse cx="306" cy="121" rx="5" ry="7" fill="#FFF8D8" transform="rotate(-18 306 121)"/>
        <ellipse cx="364" cy="119" rx="5" ry="7" fill="#FFF8D8" transform="rotate(-20 364 119)"/>
      </g>

      {/* Brillos principales */}
      <g opacity="0.38">
        <ellipse cx="214" cy="119" rx="6" ry="8" fill="#FFFEF8" transform="rotate(-18 214 119)"/>
        <ellipse cx="335" cy="88" rx="7" ry="9" fill="#FFFEF8" transform="rotate(-14 335 88)"/>
        <ellipse cx="224" cy="186" rx="8" ry="10" fill="#FFFEF8" transform="rotate(-20 224 186)"/>
        <ellipse cx="368" cy="177" rx="8" ry="10" fill="#FFFEF8" transform="rotate(-16 368 177)"/>
        <ellipse cx="332" cy="217" rx="9" ry="11" fill="#FFFEF8" transform="rotate(-12 332 217)"/>
        <ellipse cx="470" cy="238" rx="9" ry="11" fill="#FFFEF8" transform="rotate(-22 470 238)"/>
        <ellipse cx="198" cy="240" rx="9" ry="11" fill="#FFFEF8" transform="rotate(-18 198 240)"/>
        <ellipse cx="215" cy="265" rx="9" ry="11" fill="#FFFEF8" transform="rotate(-20 215 265)"/>
        <ellipse cx="428" cy="260" rx="9" ry="11" fill="#FFFEF8" transform="rotate(-15 428 260)"/>
        <ellipse cx="333" cy="289" rx="9" ry="11" fill="#FFFEF8" transform="rotate(-18 333 289)"/>
        <ellipse cx="445" cy="117" rx="6" ry="8" fill="#FFFEF8" transform="rotate(-20 445 117)"/>
        <ellipse cx="498" cy="200" rx="8" ry="10" fill="#FFFEF8" transform="rotate(-16 498 200)"/>
        <ellipse cx="410" cy="140" rx="7" ry="9" fill="#FFFEF8" transform="rotate(-14 410 140)"/>
        <ellipse cx="523" cy="230" rx="5" ry="6" fill="#FFFEF8" transform="rotate(-20 523 230)"/>
        <ellipse cx="293" cy="290" rx="8" ry="10" fill="#FFFEF8" transform="rotate(-18 293 290)"/>
        <ellipse cx="448" cy="288" rx="9" ry="11" fill="#FFFEF8" transform="rotate(-16 448 288)"/>
      </g>
    </svg>
  );
}
