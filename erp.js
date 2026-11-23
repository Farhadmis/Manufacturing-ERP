<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Mainetti · Finish Good</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>
  <script src="erp.js"></script>
  <style>
    :root {
      --navy: #0f2a5a;
      --red: #a61935;
      --blue: #2b5bb8;
      --mute: #6d7c99;
      --line: #dbe4f2;
      --bg: #f1f5fb
    }

    * {
      box-sizing: border-box
    }

    body {
      margin: 0;
      font-family: Inter, system-ui, sans-serif;
      background: var(--bg);
      color: var(--navy);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-size: 13px
    }

    header {
      flex: none;
      height: 64px;
      background: linear-gradient(100deg, #5c0716, #8d0b20 45%, #b3122f);
      color: #fff;
      padding: 0 22px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 6px 20px rgba(100, 10, 30, .25);
      z-index: 6
    }

    .bk {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, .4);
      background: rgba(255, 255, 255, .12);
      color: #fff;
      font-size: 18px;
      cursor: pointer
    }

    .logo {
      font-weight: 800;
      letter-spacing: .06em;
      font-size: 16px;
      line-height: 1
    }

    .logo small {
      display: block;
      font-size: 8px;
      font-weight: 600;
      letter-spacing: .2em;
      opacity: .8;
      margin-top: 3px
    }

    .sep {
      width: 1px;
      height: 30px;
      background: rgba(255, 255, 255, .35)
    }

    .ttl {
      flex: 1
    }

    .ttl b {
      font-size: 18px;
      display: block
    }

    .ttl span {
      font-size: 12px;
      opacity: .85
    }

    .user {
      position: relative
    }

    .ub {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, .14);
      border: 1px solid rgba(255, 255, 255, .4);
      color: #fff;
      border-radius: 999px;
      padding: 5px 14px 5px 5px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px
    }

    .av {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #fff;
      color: var(--red);
      display: grid;
      place-items: center;
      font-weight: 800;
      font-size: 11px
    }

    .menu {
      position: absolute;
      right: 0;
      top: 44px;
      background: #fff;
      color: var(--navy);
      border-radius: 12px;
      box-shadow: 0 14px 34px rgba(16, 44, 92, .25);
      min-width: 150px;
      display: none;
      overflow: hidden
    }

    .menu div {
      padding: 11px 16px;
      cursor: pointer;
      font-weight: 600
    }

    .menu div:hover {
      background: #f1f5fc
    }

    .lay {
      flex: 1;
      min-height: 0;
      display: flex
    }

    aside {
      flex: none;
      width: 214px;
      background: #fff;
      border-right: 1px solid var(--line);
      padding: 10px 0;
      transition: .2s;
      overflow: hidden
    }

    aside.col {
      width: 62px
    }

    .nv {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 20px;
      cursor: pointer;
      font-weight: 600;
      color: #3a4d73;
      border-left: 3px solid transparent;
      white-space: nowrap
    }

    .nv svg {
      width: 20px;
      height: 20px;
      flex: none;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.9;
      stroke-linecap: round;
      stroke-linejoin: round
    }

    .nv:hover {
      background: #f5f8fd
    }

    .nv.on {
      color: var(--red);
      background: #fdeff2;
      border-left-color: var(--red)
    }

    .nv.t {
      color: var(--mute);
      margin-bottom: 6px
    }

    main {
      flex: 1;
      min-width: 0;
      overflow: auto;
      padding: 0 22px 30px
    }

    .fb {
      display: flex;
      gap: 8px;
      align-items: center;
      overflow-x: auto;
      padding: 12px 0 10px;
      position: sticky;
      top: 0;
      z-index: 4;
      background: var(--bg)
    }

    .f {
      flex: 1 1 0;
      min-width: 108px;
      position: relative
    }

    .f button,
    .f input {
      width: 100%;
      height: 36px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #fff;
      color: var(--navy);
      font: 600 12px Inter, sans-serif;
      padding: 0 10px;
      text-align: left;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis
    }

    .f button.on {
      border-color: var(--red);
      background: #fdf3f5;
      color: var(--red)
    }

    .f button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px
    }

    .f button:after {
      content: "▾";
      opacity: .6;
      flex: none
    }

    .f.d {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 150px;
      flex: 1.2 1 0
    }

    .f.d span {
      font-weight: 700;
      font-size: 11px;
      color: var(--mute)
    }

    .f.d input {
      padding: 0 6px
    }

    .rs {
      flex: none;
      height: 36px;
      border: 0;
      border-radius: 10px;
      background: var(--navy);
      color: #fff;
      padding: 0 14px;
      font-weight: 700;
      cursor: pointer
    }

    #pn {
      position: fixed;
      z-index: 50;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: 0 14px 34px rgba(16, 44, 92, .22);
      width: 230px;
      display: none
    }

    #pn input[type=text] {
      width: calc(100% - 16px);
      margin: 8px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 7px 10px;
      font: 12px Inter
    }

    #pn .ls {
      max-height: 240px;
      overflow: auto
    }

    #pn label {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 12px
    }

    #pn label:hover {
      background: #f3f7fd
    }

    #pn .ac {
      display: flex;
      gap: 8px;
      padding: 8px;
      border-top: 1px solid var(--line)
    }

    #pn .ac button {
      flex: 1;
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 8px;
      padding: 6px;
      font-weight: 600;
      cursor: pointer;
      color: var(--navy)
    }

    .kp {
      display: flex;
      gap: 12px;
      margin: 6px 0 14px
    }

    .k {
      flex: 1;
      background: #fff;
      border-radius: 14px;
      padding: 13px 16px;
      border-top: 3px solid var(--red);
      box-shadow: 0 5px 16px rgba(16, 44, 92, .07);
      min-width: 0
    }

    .k.b {
      border-top-color: var(--blue)
    }

    .k.o {
      flex: 1.5;
      border-top-color: #e08a00
    }

    .k small {
      color: var(--mute);
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .05em
    }

    .k b {
      display: block;
      font-size: 21px;
      margin-top: 4px;
      white-space: nowrap
    }

    .k .oo {
      display: flex;
      gap: 16px;
      margin-top: 4px
    }

    .k .oo div {
      flex: 1
    }

    .k .oo b {
      font-size: 15px;
      margin: 0
    }

    .k .oo i {
      font-style: normal;
      font-size: 11px;
      color: var(--mute);
      display: block
    }

    .cg {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px
    }

    .c {
      background: #fff;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 5px 16px rgba(16, 44, 92, .07);
      min-width: 0
    }

    .c.w {
      grid-column: 1/-1
    }

    .bd-hd {
      margin: -16px -16px 16px;
      padding: 16px 18px;
      border-radius: 14px 14px 0 0;
      background: linear-gradient(100deg, #0b3c8f 0%, #1553b8 55%, #1d7ae0 100%);
      color: #fff
    }

    .bd-ht {
      font-size: 18px;
      font-weight: 800;
      display: flex;
      align-items: center;
      letter-spacing: -.01em
    }

    .bd-sub {
      font-weight: 500;
      color: #9fd0ff;
      margin-left: 6px
    }

    .tpT {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px
    }

    .tpT thead th {
      background: #12306b;
      color: #fff;
      font-size: 11.5px;
      font-weight: 700;
      padding: 10px 12px;
      text-align: right
    }

    .tpT thead th:first-child {
      text-align: left
    }

    .tpT td {
      padding: 9px 12px;
      border-top: 1px solid #eef1f7;
      text-align: right;
      color: #0f2a5a;
      font-weight: 700;
      white-space: nowrap
    }

    .tpT td:first-child {
      text-align: left
    }

    .tpT .tpd {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle
    }

    .tpT em {
      font-style: normal;
      display: inline-block;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700
    }

    .bd-ht svg {
      width: 18px;
      height: 18px;
      fill: none;
      stroke: #fff;
      stroke-width: 2.2;
      stroke-linecap: round;
      margin-right: 10px
    }

    .c h4 {
      margin: 0 0 10px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px
    }

    .cv {
      position: relative;
      height: 270px
    }

    .c select {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 5px 8px;
      font: 600 12px Inter;
      color: var(--navy)
    }

    .hm {
      overflow: auto
    }

    .hm table {
      border-collapse: separate;
      border-spacing: 3px;
      width: 100%
    }

    .hm th {
      font-size: 11px;
      color: var(--mute);
      padding: 6px;
      text-align: center
    }

    .hm td {
      padding: 10px 6px;
      text-align: center;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      min-width: 62px
    }

    .hm td.y,
    .hm th.y {
      background: none;
      text-align: left;
      font-weight: 800;
      color: var(--navy)
    }

    .hm td.t {
      background: #eef3fb
    }

    .tb {
      overflow: auto;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 5px 16px rgba(16, 44, 92, .07);
      max-height: calc(100vh - 290px)
    }

    .tb table {
      width: 100%;
      border-collapse: collapse
    }

    .tb th {
      position: sticky;
      top: 0;
      background: #f4f8ff;
      color: var(--mute);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .04em;
      text-align: left;
      padding: 11px 12px;
      white-space: nowrap
    }

    .tb td {
      padding: 9px 12px;
      border-bottom: 1px solid #edf2fa;
      white-space: nowrap
    }

    .tb td.r,
    .tb th.r {
      text-align: right
    }

    .tb td:nth-child(2) {
      max-width: 230px;
      overflow: hidden;
      text-overflow: ellipsis
    }

    .tb tr:hover td {
      background: #fafcff
    }

    .tag {
      padding: 2px 9px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 700;
      background: #fff1d6;
      color: #a86400
    }

    .tag.ic {
      background: #dcf0ff;
      color: #1d5fa8
    }

    .pg {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 2px;
      color: var(--mute);
      gap: 10px
    }

    .btn {
      border: 0;
      border-radius: 10px;
      padding: 9px 16px;
      font-weight: 700;
      cursor: pointer;
      background: var(--navy);
      color: #fff;
      font-size: 12px
    }

    .btn.g {
      background: #fff;
      color: var(--navy);
      border: 1px solid var(--line)
    }

    .btn.red {
      background: var(--red)
    }

    .empty {
      background: #fff;
      border-radius: 16px;
      padding: 60px 20px;
      text-align: center;
      color: var(--mute);
      margin-top: 18px
    }

    .empty b {
      display: block;
      color: var(--navy);
      font-size: 17px;
      margin-bottom: 6px
    }

    @media(max-width:900px) {
      .cg {
        grid-template-columns: 1fr
      }

      .kp {
        overflow-x: auto
      }

      .k {
        min-width: 150px
      }

      aside {
        width: 62px
      }

      .nv span {
        display: none
      }

      .ttl span {
        display: none
      }
    }

    .g3 {
      grid-column: 1/-1;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px
    }

    .pv th.yh {
      cursor: pointer;
      text-align: center;
      background: #e9f1fc;
      color: var(--navy);
      user-select: none
    }

    .pv th.r {
      text-align: right
    }

    .pv tr.h2 th {
      top: 37px
    }

    .pv th {
      z-index: 2
    }

    .pv td.s,
    .pv th.s {
      position: sticky;
      left: 0;
      background: #fff;
      z-index: 3;
      min-width: 110px;
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 700
    }

    .pv th.s {
      background: #f4f8ff;
      z-index: 4
    }

    .pv td.db {
      position: relative;
      padding: 0;
      min-width: 92px
    }

    .pv td.db i {
      position: absolute;
      left: 3px;
      top: 4px;
      bottom: 4px;
      max-width: calc(100% - 6px);
      border: 1px solid #63be7b;
      border-radius: 2px;
      background: linear-gradient(90deg, #63be7b, #d5f0dd)
    }

    .pv td.db span {
      position: relative;
      display: block;
      padding: 9px 12px;
      text-align: right
    }

    .pv td em {
      font-style: normal;
      color: #3a4d73;
      font-weight: 600
    }

    .pv th.r {
      min-width: 92px
    }

    @media(max-width:900px) {
      .g3 {
        grid-template-columns: 1fr
      }
    }

    /* ===== Raw Data · premium cards & table (scoped: rk-* / pv2 / rwt only) ===== */
    .rkp {
      display: flex;
      gap: 14px;
      margin: 6px 0 16px
    }

    .rk {
      flex: 1 1 0;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 16px;
      color: #fff;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(10, 40, 100, .22), inset 0 0 0 1px rgba(255, 255, 255, .18)
    }

    .rk:before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(120% 90% at 0% 0%, rgba(255, 255, 255, .22), transparent 55%);
      pointer-events: none
    }

    .rk-t {
      background: linear-gradient(135deg, #0d3b99, #06214f)
    }

    .rk-1 {
      background: linear-gradient(135deg, #2158e0, #0b2f8f)
    }

    .rk-2 {
      background: linear-gradient(135deg, #14b8d4, #0c6f8c)
    }

    .rk-3 {
      background: linear-gradient(135deg, #34c759, #15803d)
    }

    .rk-5 {
      background: linear-gradient(135deg, #8b5cf6, #4c1d95)
    }

    .rk-ic {
      position: relative;
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, .18);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .35)
    }

    .rk-ic svg {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: #fff;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round
    }

    .rk-tx {
      position: relative;
      min-width: 0;
      flex: 1
    }

    .rk-tx small {
      display: block;
      font-size: 12px;
      font-weight: 700;
      opacity: .95
    }

    .rk-tx b {
      display: block;
      font-size: 20px;
      font-weight: 800;
      margin: 2px 0 4px;
      white-space: nowrap;
      letter-spacing: -.01em
    }

    .rk-g {
      font-size: 11.5px;
      font-weight: 700;
      white-space: nowrap
    }

    .rk-g.up {
      color: #9bffc0
    }

    .rk-g.dn {
      color: #ffc2c2
    }

    .rk-g.na {
      opacity: .7
    }

    .rk-bars {
      position: absolute;
      right: 12px;
      bottom: 12px;
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 26px
    }

    .rk-bars i {
      display: block;
      width: 5px;
      border-radius: 2px 2px 0 0;
      background: rgba(255, 255, 255, .35)
    }

    .rk-bars i.l {
      background: rgba(255, 255, 255, .85)
    }

    .rwt {
      overflow: auto;
      background: #fff;
      border-radius: 16px;
      border: 1px solid #c9d9f2;
      box-shadow: 0 8px 22px rgba(16, 44, 92, .10);
      max-height: calc(100vh - 300px)
    }

    .pv2 {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 12.5px;
      font-variant-numeric: tabular-nums
    }

    .pv2 th {
      position: sticky;
      z-index: 3;
      color: #fff;
      white-space: nowrap;
      padding: 0 10px;
      text-align: center
    }

    .pv2 thead tr:first-child th {
      top: 0;
      height: 42px
    }

    .pv2 thead tr:nth-child(2) th {
      top: 42px;
      height: 28px
    }

    .pv2 th.mh {
      background: linear-gradient(180deg, #0c3a8f, #052a72);
      font-size: 14px;
      font-weight: 800;
      z-index: 6
    }

    .pv2 th.yh {
      background: linear-gradient(180deg, #154aa8, #0e3d96);
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      user-select: none;
      border-left: 1px solid rgba(255, 255, 255, .22)
    }

    .pv2 th.yh i {
      font-style: normal;
      font-size: 10px;
      opacity: .7;
      margin-left: 6px;
      vertical-align: middle
    }

    .pv2 th.sh {
      background: #0e3d96;
      font-size: 11px;
      font-weight: 600;
      color: #dbe8ff;
      border-top: 1px solid rgba(255, 255, 255, .18)
    }

    .pv2 th.ys {
      border-left: 1px solid rgba(255, 255, 255, .22)
    }

    /* ===== month → date-wise drill-down ===== */
    .pv2 thead tr:nth-child(3) th {
      top: 70px;
      height: 26px
    }

    .pv2 th.sh.mo {
      cursor: pointer;
      user-select: none
    }

    .pv2 th.sh.mo:hover {
      background: #154aa8
    }

    .pv2 th.sh.mo i {
      font-style: normal;
      font-size: 9px;
      opacity: .75;
      margin-left: 5px
    }

    .pv2 th.sh.dh {
      background: #0b3182;
      font-size: 10.5px;
      color: #cfe0ff;
      min-width: 88px
    }

    .pv2 td.bc.dc {
      min-width: 88px
    }

    .pv2 th.c1,
    .pv2 td.c1 {
      left: 0;
      min-width: 96px;
      max-width: 96px
    }

    .pv2 th.c2,
    .pv2 td.c2 {
      left: 96px;
      min-width: 84px;
      max-width: 84px
    }

    .pv2 th.gh {
      right: 0
    }

    .pv2 td {
      height: 34px;
      padding: 0;
      border-bottom: 1px solid #e3ebf7;
      white-space: nowrap
    }

    .pv2 td.c1,
    .pv2 td.c2 {
      position: sticky;
      background: #fff;
      z-index: 2;
      font-weight: 800;
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis
    }

    .pv2 td.c2 {
      border-right: 1px solid #e3ebf7
    }

    .pv2 td.bc {
      position: relative;
      min-width: 128px
    }

    .pv2 td.bc i {
      position: absolute;
      left: 3px;
      top: 5px;
      bottom: 5px;
      max-width: calc(100% - 6px);
      border-radius: 3px;
      background: linear-gradient(90deg, #3fcf6b 0%, #8fe3a9 55%, rgba(220, 247, 228, .55) 100%)
    }

    .pv2 td.bc span {
      position: relative;
      display: block;
      text-align: center;
      padding: 0 10px;
      font-weight: 600;
      color: #10285a;
      line-height: 34px
    }

    .pv2 td.bc.z span {
      color: #7b89a6
    }

    .pv2 td.bc.gc {
      position: sticky;
      right: 0;
      z-index: 2;
      background: #fff;
      min-width: 150px;
      box-shadow: -6px 0 8px -6px rgba(16, 44, 92, .22)
    }

    .pv2 td.bc.gc span {
      font-weight: 700
    }

    .pv2 td.bc.gc em {
      font-style: normal;
      margin-left: 8px;
      font-weight: 700;
      color: #3a4d73
    }

    .pv2 td.ys {
      border-left: 1px solid #d3e0f4
    }

    .pv2 tbody tr:hover td {
      background-color: #f6faff
    }

    .pv2 tfoot td {
      position: sticky;
      bottom: 0;
      z-index: 3;
      height: 46px;
      padding: 0 10px;
      text-align: center;
      font-weight: 800;
      font-size: 14px;
      color: #fff;
      background: linear-gradient(180deg, #0c3a8f, #052a72);
      border-left: 1px solid rgba(255, 255, 255, .18);
      border-bottom: 0
    }

    .pv2 tfoot td.f1 {
      left: 0;
      z-index: 5;
      text-align: left;
      font-size: 13px;
      min-width: 180px;
      max-width: none
    }

    .pv2 tfoot td.f1 svg {
      width: 18px;
      height: 18px;
      vertical-align: -4px;
      margin-right: 8px;
      fill: none;
      stroke: #fff;
      stroke-width: 1.9;
      stroke-linecap: round;
      stroke-linejoin: round
    }

    .pv2 tfoot td.gt {
      right: 0;
      z-index: 5;
      background: linear-gradient(180deg, #1a6dff, #0a4fd6);
      font-size: 15px
    }

    @media(max-width:900px) {
      .rkp {
        overflow-x: auto
      }

      .rk {
        min-width: 210px
      }
    }

    /* ===== v2: filter bar সবসময় এক লাইনে (zoom করলেও scroll নেই) ===== */
    .fb {
      overflow: hidden !important;
      flex-wrap: nowrap !important;
      gap: clamp(3px, .5vw, 8px) !important
    }

    .f,
    .f.d {
      min-width: 0 !important;
      flex: 1 1 0 !important
    }

    .f.d {
      flex: 1.5 1 0 !important;
      gap: 3px !important
    }

    .f button,
    .f input {
      min-width: 0;
      font-size: clamp(9px, .82vw, 12px) !important;
      padding: 0 clamp(4px, .6vw, 10px) !important;
      height: clamp(28px, 2.6vw, 36px) !important
    }

    .f.d input {
      padding: 0 2px !important;
      letter-spacing: -.2px
    }

    .f.d span {
      font-size: clamp(8px, .75vw, 11px) !important
    }

    .rs {
      padding: 0 clamp(8px, 1vw, 14px) !important;
      font-size: clamp(10px, .85vw, 13px) !important;
      height: clamp(28px, 2.6vw, 36px) !important
    }

    /* ===== v2: Raw Data বাটন (Expand/Collapse/Prev/Next/Download) ===== */
    .pg .bx {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 38px;
      padding: 0 16px;
      border-radius: 999px;
      background: #fff;
      color: var(--navy);
      border: 1.5px solid #cfdcf3;
      font: 700 13px Inter, sans-serif;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(16, 44, 92, .08);
      transition: .15s;
      white-space: nowrap
    }

    .pg .bx:hover {
      border-color: #2f6fe4;
      box-shadow: 0 4px 12px rgba(47, 111, 228, .2)
    }

    .pg .bx i {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #2f6fe4;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: none
    }

    .pg .bx i svg {
      width: 12px;
      height: 12px;
      stroke: #fff;
      stroke-width: 2.6;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round
    }

    .pg .bx.dk {
      background: var(--navy);
      color: #fff;
      border-color: var(--navy)
    }

    .pg .bx.dk svg {
      width: 15px;
      height: 15px;
      stroke: #fff;
      stroke-width: 2.2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round
    }

    /* ===== v3: Raw Data KPI cards — glossy style ===== */
    .rkp {
      gap: clamp(8px, 1vw, 16px) !important
    }

    .rk {
      min-height: 92px;
      padding: 14px clamp(10px, 1.1vw, 18px) !important;
      gap: clamp(8px, .9vw, 14px) !important;
      border-radius: 16px !important;
      box-shadow: 0 10px 24px rgba(10, 40, 100, .25), inset 0 0 0 1.5px rgba(255, 255, 255, .38), inset 0 2px 10px rgba(255, 255, 255, .18) !important
    }

    .rk:before {
      background: radial-gradient(110% 80% at 0% 0%, rgba(255, 255, 255, .30), transparent 55%), linear-gradient(180deg, rgba(255, 255, 255, .10), transparent 40%) !important
    }

    .rk-t {
      background: linear-gradient(135deg, #0b4fd0, #061f5e) !important
    }

    .rk-1 {
      background: linear-gradient(135deg, #2f6bf0, #102c9c) !important
    }

    .rk-2 {
      background: linear-gradient(135deg, #27d3ee, #0a6f8f) !important
    }

    .rk-3 {
      background: linear-gradient(135deg, #46d868, #0f7a36) !important
    }

    .rk-5 {
      background: linear-gradient(135deg, #9a6bff, #45199a) !important
    }

    .rk-ic {
      width: clamp(40px, 3.6vw, 54px) !important;
      height: clamp(40px, 3.6vw, 54px) !important;
      background: radial-gradient(circle at 30% 25%, rgba(255, 255, 255, .38), rgba(255, 255, 255, .12)) !important;
      box-shadow: inset 0 0 0 2px rgba(255, 255, 255, .55), 0 4px 10px rgba(0, 0, 0, .18) !important;
      z-index: 1
    }

    .rk-ic svg {
      width: 56% !important;
      height: 56% !important;
      stroke: none !important;
      fill: #fff !important;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, .25))
    }

    .rk-tx {
      z-index: 1
    }

    .rk-tx small {
      font-size: clamp(11px, .9vw, 13px) !important;
      font-weight: 700 !important;
      opacity: 1 !important
    }

    .rk-tx b {
      font-size: clamp(17px, 1.65vw, 24px) !important;
      font-weight: 800 !important;
      margin: 3px 0 6px !important;
      text-shadow: 0 1px 3px rgba(0, 0, 0, .2)
    }

    .rk-g {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #fff !important;
      font-size: clamp(10.5px, .85vw, 12.5px) !important;
      font-weight: 700 !important;
      opacity: 1 !important
    }

    .rk-g em {
      font-style: normal;
      font-size: 10px;
      line-height: 1
    }

    .rk-g.up em {
      color: #5dff8f
    }

    .rk-g.dn em {
      color: #ff8f8f
    }

    .rk-bars {
      right: 10px !important;
      bottom: 8px !important;
      gap: 3px !important;
      height: 40px !important;
      align-items: flex-end;
      z-index: 0
    }

    .rk-bars i {
      width: 6px !important;
      border-radius: 2px 2px 0 0 !important;
      background: linear-gradient(180deg, rgba(255, 255, 255, .5), rgba(255, 255, 255, .12)) !important
    }

    .rk-bars i.l {
      background: linear-gradient(180deg, rgba(255, 255, 255, .95), rgba(255, 255, 255, .35)) !important
    }

    .rk-bars svg {
      position: absolute;
      left: 0;
      bottom: 0;
      pointer-events: none;
      overflow: visible
    }

    @media(max-width:1250px) {
      .rk-bars {
        opacity: .55;
        transform: scale(.8);
        transform-origin: right bottom
      }
    }

    /* ===== Portal-style header (same as Mainetti ERP Portal) ===== */
    header {
      height: clamp(66px, 9vh, 88px);
      padding: 0;
      gap: 0;
      align-items: stretch;
      color: var(--navy);
      background: linear-gradient(90deg, #f8fbff, #e8f0fc);
      box-shadow: 0 4px 18px rgba(16, 44, 92, .12);
      position: relative;
      z-index: 20
    }

    header .hl {
      display: flex;
      align-items: center;
      gap: clamp(12px, 1.5vw, 24px);
      padding: 0 clamp(14px, 1.8vw, 30px);
      position: relative;
      z-index: 2;
      flex: none
    }

    header .hl img {
      height: clamp(40px, 6.2vh, 58px);
      display: block
    }

    header .bk {
      width: 36px;
      height: 36px;
      flex: none;
      border-radius: 10px;
      border: 1px solid #b9c8e3;
      background: #fff;
      color: #12408f;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(16, 44, 92, .10)
    }

    header .bk:hover {
      border-color: #2f6fe4
    }

    header .logo {
      font-weight: 800;
      letter-spacing: .06em;
      font-size: 20px;
      line-height: 1;
      color: var(--navy)
    }

    header .logo small {
      display: block;
      font-size: 9px;
      letter-spacing: .2em;
      margin-top: 3px;
      color: #12408f;
      opacity: 1;
      font-weight: 700
    }

    header .sep {
      width: 1px;
      height: 46px;
      background: #9fb3d3;
      flex: none
    }

    header .tag {
      background: none;
      padding: 0;
      border-radius: 0;
      font-style: italic;
      font-weight: 600;
      color: #12408f;
      font-size: clamp(12px, 1.15vw, 18px);
      white-space: nowrap
    }

    header .tag i {
      font-style: normal;
      margin: 0 .7em;
      opacity: .55
    }

    header .gr {
      font-size: 11.5px;
      color: var(--mute);
      margin-top: 3px;
      white-space: nowrap
    }

    header .hp {
      flex: 1;
      min-width: 0;
      position: relative;
      overflow: hidden
    }

    header .hp:before {
      content: "";
      position: absolute;
      inset: 0;
      background: url(assets/header-photo.jpg) right center/cover no-repeat;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 40%);
      mask-image: linear-gradient(90deg, transparent, #000 40%)
    }

    header .hr {
      position: relative;
      display: flex;
      align-items: center;
      gap: clamp(10px, 1.2vw, 18px);
      padding: 0 clamp(14px, 1.6vw, 26px) 0 clamp(54px, 5vw, 84px);
      color: #fff;
      flex: none
    }

    header .hr:before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(100deg, #0a2a70, #0b3d94);
      clip-path: polygon(44px 0, 100% 0, 100% 100%, 0 100%);
      z-index: 0
    }

    header .hr>* {
      position: relative;
      z-index: 1
    }

    header .hr svg.fy {
      width: clamp(30px, 2.6vw, 42px);
      height: clamp(30px, 2.6vw, 42px);
      flex: none
    }

    header .ht b {
      display: block;
      font-size: clamp(15px, 1.5vw, 23px);
      font-weight: 800;
      white-space: nowrap
    }

    header .ht span {
      display: block;
      font-size: clamp(9.5px, .8vw, 12px);
      opacity: .92;
      margin-top: 2px;
      white-space: nowrap
    }

    header .ub {
      padding: 4px 14px 4px 4px;
      font-family: inherit
    }

    header .av {
      width: 30px;
      height: 30px;
      font-size: 12px;
      color: #0b3d94
    }

    header .menu {
      top: 46px
    }

    @media(max-width:1000px) {

      header .hp,
      header .gr {
        display: none
      }

      header .hp {
        flex: 1
      }
    }

    @media(max-width:700px) {

      header .tag,
      header .sep {
        display: none
      }
    }
  </style>
  <style id="rsp-v1">
    /* ===================== RESPONSIVE v1 · Mobile collapsible filter ===================== */
    .fbc {
      display: contents
    }

    .fbt,
    .fba {
      display: none
    }

    @media(max-width:767px) {
      .fbt {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        height: 46px;
        margin: 10px 0 8px;
        padding: 0 14px;
        border: 1px solid #dbe4f2;
        border-radius: 14px;
        background: #fff;
        color: #0f2a5a;
        font: 700 14px Inter, system-ui, sans-serif;
        text-align: left;
        cursor: pointer;
        position: sticky;
        top: 6px;
        z-index: 45;
        box-shadow: 0 0 0 6px #f1f5fb, 0 4px 12px rgba(16, 44, 92, .10);
        -webkit-tap-highlight-color: transparent
      }

      .fbt[hidden] {
        display: none !important
      }

      .fbt svg {
        width: 18px;
        height: 18px;
        flex: none;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round
      }

      .fbt .fbl {
        flex: 1
      }

      .fbt .fbn {
        min-width: 22px;
        height: 22px;
        padding: 0 7px;
        border-radius: 999px;
        background: #a61935;
        color: #fff;
        font-size: 12px;
        line-height: 22px;
        text-align: center
      }

      .fbt .fbn:empty {
        display: none
      }

      .fbt .fbv {
        transition: transform .3s ease
      }

      .fbt[aria-expanded="true"] .fbv {
        transform: rotate(180deg)
      }

      .fbc {
        display: block;
        overflow: hidden;
        max-height: var(--fbh, 0px);
        opacity: 0;
        visibility: hidden;
        transition: max-height .35s ease, opacity .3s ease, visibility 0s linear .35s
      }

      .fbc.open {
        opacity: 1;
        visibility: visible;
        transition: max-height .35s ease, opacity .3s ease, visibility 0s
      }

      .fbc #fb {
        position: static !important;
        display: flex !important;
        flex-direction: column !important;
        flex-wrap: nowrap !important;
        align-items: stretch !important;
        gap: 10px !important;
        overflow: visible !important;
        white-space: normal !important;
        height: auto !important;
        zoom: 1 !important;
        margin: 0 !important;
        padding: 12px 12px 6px !important;
        background: #fff !important;
        border: 1px solid #dbe4f2 !important;
        border-bottom: 0 !important;
        border-radius: 14px 14px 0 0 !important;
        box-shadow: none !important
      }

      .fbc #fb:empty {
        padding: 0 !important;
        border: 0 !important
      }

      .fbc #fb .f,
      .fbc #fb .f.d {
        flex: none !important;
        width: 100% !important;
        min-width: 0 !important
      }

      .fbc #fb .f button,
      .fbc #fb .f input {
        height: 44px !important;
        font-size: 14px !important;
        padding: 0 12px !important;
        letter-spacing: normal !important;
        border-radius: 12px !important
      }

      .fbc #fb .f.d {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important
      }

      .fbc #fb .f.d span {
        flex: none;
        width: 44px;
        font-size: 13px !important
      }

      .fbc #fb .f.d input {
        flex: 1 1 auto;
        min-width: 0;
        width: auto !important
      }

      .fbc #fb .rs {
        display: none !important
      }

      /* Shopfloor pills / dates */
      .fbc #fb .fp {
        width: 100% !important;
        min-height: 44px;
        padding: 10px 14px !important;
        font-size: 14px !important;
        gap: 10px !important;
        border-radius: 12px !important;
        white-space: normal;
        flex: none !important
      }

      .fbc #fb .fp .fl {
        flex: 1;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis
      }

      .fbc #fb .fp svg:not(.cv) {
        display: block !important
      }

      .fbc #fb .fd {
        width: 100%;
        justify-content: space-between;
        gap: 10px !important;
        font-size: 13px !important;
        flex: none
      }

      .fbc #fb .fd input {
        flex: 1 1 auto;
        width: auto !important;
        min-width: 0;
        max-width: 220px;
        padding: 10px 12px !important;
        font-size: 14px !important;
        border-radius: 12px !important
      }

      .fbc #fb .fsep {
        display: none !important
      }

      .fba {
        display: flex;
        gap: 10px;
        padding: 10px 12px 12px;
        margin: 0 0 8px;
        background: #fff;
        border: 1px solid #dbe4f2;
        border-top: 1px dashed #dbe4f2;
        border-radius: 0 0 14px 14px
      }

      .fba button {
        flex: 1;
        height: 44px;
        border-radius: 12px;
        font: 700 14px Inter, system-ui, sans-serif;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent
      }

      .fba .fbr {
        background: #fff;
        color: #0f2a5a;
        border: 1.5px solid #cfdcf3
      }

      .fba .fbp {
        background: #0f2a5a;
        color: #fff;
        border: 0
      }

      .fbw {
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
        background: none !important
      }

      /* dropdown → bottom sheet (কোনো filter-এর ওপর ভাসে না) */
      #pn,
      .pop {
        left: 0 !important;
        right: 0 !important;
        top: auto !important;
        bottom: 0 !important;
        width: 100% !important;
        max-height: 72vh;
        border-radius: 18px 18px 0 0 !important;
        padding-bottom: env(safe-area-inset-bottom, 0px);
        overflow: hidden
      }

      #pn .ls,
      .pop .ls {
        max-height: calc(72vh - 150px) !important;
        -webkit-overflow-scrolling: touch
      }

      #pn label,
      .pop label {
        padding: 12px 16px !important;
        font-size: 14px !important
      }

      #pn input[type=text],
      .pop input[type=text] {
        font-size: 16px !important;
        padding: 10px 12px !important
      }

      #pn .ac button,
      .pop .ft a {
        padding: 10px !important;
        font-size: 14px !important
      }
    }

    /* ===================== RESPONSIVE v1 · layout (mobile / tablet / large display) ===================== */
    html {
      -webkit-text-size-adjust: 100%
    }

    @media(max-width:767px) {
      main {
        padding-left: 12px !important;
        padding-right: 12px !important;
        padding-bottom: 24px !important
      }

      .kp,
      .rkp {
        scroll-snap-type: x proximity
      }
    }

    @media(min-width:2000px) {
      main>* {
        max-width: 2100px;
        margin-left: auto;
        margin-right: auto
      }
    }
  </style>
</head>

<body>
  <header>
    <div class="hl">
      <button class="bk" onclick="location.href='portal.html'" title="Back to portal">←</button>
      <img src="assets/logo.png" alt="Mainetti Bangladesh"
        onerror="this.outerHTML='&lt;div class=&quot;logo&quot;&gt;MAINETTI&lt;small&gt;BANGLADESH PVT. LTD.&lt;/small&gt;&lt;/div&gt;'">
      <div class="sep"></div>
      <div>
        <div class="tag">Drive Efficiency<i>/</i>Ensure Quality<i>/</i>Grow Together</div>
        <div class="gr" id="gr"></div>
      </div>
    </div>
    <div class="hp"></div>
    <div class="hr"><svg class="fy" viewBox="0 0 24 24">
        <path fill="#fff" d="M2 21V10l6 3.6V10l6 3.6V4h3.4v9.6H22V21z" />
        <path fill="rgba(11,61,148,.55)" d="M5 17h2.2v2.2H5zM10 17h2.2v2.2H10zM15 17h2.2v2.2H15z" />
        <path fill="#fff" opacity=".7" d="M16.2 1.5h2.6v2h-2.6z" />
      </svg>
      <div class="ht"><b>Finish Good</b><span>Production output &amp; analytics</span></div>
      <div class="user"><button class="ub" id="ub"><span class="av" id="av"></span><span id="un"></span> ▾</button>
        <div class="menu" id="mn">
          <div onclick="location.href='portal.html'">Portal</div>
          <div onclick="out()">Sign out</div>
        </div>
      </div>
    </div>
  </header>
  <div class="lay">
    <aside id="sd">
      <div class="nv t" onclick="$('#sd').classList.toggle('col')"><svg viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg><span>Menu</span></div>
      <div class="nv on" data-p="ov" onclick="show('ov')"><svg viewBox="0 0 24 24">
          <path d="M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z" />
        </svg><span>Overview</span></div>
      <div class="nv" data-p="raw" onclick="show('raw')"><svg viewBox="0 0 24 24">
          <path d="M3 5h18v14H3zM3 10h18M9 5v14" />
        </svg><span>Raw Data</span></div>
    </aside>
    <main id="mn2">
      <div class="fb" id="fb"></div>
      <div id="pgc"></div>
    </main>
  </div>
  <div id="pn"></div>
  <script>
    const $ = s => document.querySelector(s), esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    let ME = null; const out = () => ERP.signOut();
    $("#ub").onclick = e => { e.stopPropagation(); const m = $("#mn"); m.style.display = m.style.display === "block" ? "none" : "block" };
    document.addEventListener("click", e => { $("#mn").style.display = "none"; if (!e.target.closest("#pn,.f")) $("#pn").style.display = "none" });
    const MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const n0 = v => Math.round(v).toLocaleString("en-US");
    const ab = v => Math.abs(v) >= 1e6 ? +(v / 1e6).toFixed(1) + "M" : Math.abs(v) >= 1e3 ? +(v / 1e3).toFixed(0) + "K" : v;
    /* ---------- load & normalise the uploaded sheet ---------- */
    const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
    const clean = s => String(s ?? "").replace(/\s+/g, " ").trim();
    const num = v => { const x = parseFloat(String(v ?? "").replace(/,/g, "")); return isNaN(x) ? 0 : x };
    function pdate(v) {
      if (v == null || v === "") return null;
      if (typeof v === "number" && v > 20000) { const d = new Date(Math.round((v - 25569) * 864e5)); return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()] }
      v = String(v).trim(); let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if (m) return [+m[1], +m[2], +m[3]];
      m = v.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/); if (m) { let a = +m[1], b = +m[2], y = +m[3]; if (y < 100) y += 2000; return a > 12 ? [y, b, a] : [y, a, b] }
      const d = new Date(v); return isNaN(d) ? null : [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    }

    const UN = ["Unit-01", "Unit-02", "Unit-03", "Unit-05"];
    const unit = v => { const m = String(v || "").match(/(\d+)/); return m ? "Unit-" + m[1].padStart(2, "0") : clean(v) || "N/A" };
    let R = [], mod = null, msg = "";
    async function load() {
      ME = await ERP.require(); if (!ME) return false;
      const nm = ME.name || ME.login_id; $("#un").textContent = nm; { const h = new Date().getHours(); $("#gr").textContent = `Good ${h < 12 ? "morning" : h < 17 ? "afternoon" : "evening"}, ${String(nm).split(" ")[0]}. Here is your operation at a glance.` } $("#av").textContent = nm.slice(0, 2).toUpperCase();
      const tree = await ERP.tree(); mod = tree.find(m => /finish|\bfg\b/i.test(m.name));
      if (!mod) { msg = "The Finish Good module does not exist in the Admin Console."; return true }
      if (!ERP.can(ME, mod.id) && !mod.subs.some(s => ERP.can(ME, s.id, "v", mod.id))) { msg = "You do not have access to the Finish Good module."; return true }
      ERP.sideBanner([mod.id, ...mod.subs.map(s => s.id)], [[mod.id, "fg"]]);
      const pk = await ERP.packed(mod.id, "fg");
      if (!pk) { msg = "No Finish Good data yet. Open fg-pack.html (admin) and upload the FG Excel."; return true }
      const D = pk.dict, C = pk.c, q = pk.q, N = q.length;
      const up = s => clean(s).toUpperCase();
      const T = {
        date: D.date.map(s => { const d = pdate(s); return d ? { y: d[0], m: d[1], d: d[2], ds: `${d[0]}-${String(d[1]).padStart(2, "0")}-${String(d[2]).padStart(2, "0")}` } : null }),
        unit: D.unit.map(unit), article: D.article.map(clean), model: D.model.map(up), buyer: D.buyer.map(up),
        color: D.color.map(up), shift: D.shift.map(up), prodtype: D.prodtype.map(clean), mctype: D.mctype.map(up),
        process: D.process.map(up), category: D.category.map(clean),
        tp: D.timesofprocess && C.timesofprocess ? D.timesofprocess.map(up) : null
      };
      R = new Array(N); let n = 0;
      for (let i = 0; i < N; i++) {
        const dd = T.date[C.date[i]]; if (!dd) continue;
        R[n++] = { y: dd.y, m: dd.m, d: dd.d, ds: dd.ds, unit: T.unit[C.unit[i]], art: T.article[C.article[i]], model: T.model[C.model[i]], buyer: T.buyer[C.buyer[i]], color: T.color[C.color[i]], shift: T.shift[C.shift[i]], prod: T.prodtype[C.prodtype[i]], mc: T.mctype[C.mctype[i]], proc: T.process[C.process[i]], cat: T.category[C.category[i]], tp: T.tp ? T.tp[C.timesofprocess[i]] : "", q: q[i] }
      }
      R.length = n;
      if (!R.length) msg = "The uploaded sheet has no valid rows (check the DATE column).";
      return true
    }
    /* ---------- filters ---------- */
    const FD = [["y", "Year", r => r.y], ["m", "Month", r => r.m], ["buyer", "Buyer", r => r.buyer], ["model", "Model", r => r.model], ["prod", "Prod. Type", r => r.prod], ["art", "Article", r => r.art], ["unit", "Unit", r => r.unit], ["shift", "Shift", r => r.shift], ["mc", "MC Type", r => r.mc], ["proc", "Process", r => r.proc], ["cat", "Category", r => r.cat]];
    const F = {}; FD.forEach(f => F[f[0]] = new Set()); let from = "", to = "", page = "ov";
    const opts = k => { const f = FD.find(x => x[0] === k), src = k === "model" && F.buyer.size ? R.filter(r => F.buyer.has(r.buyer)) : R, s = [...new Set(src.map(f[2]).filter(v => v !== "" && v != null))]; return s.sort((a, b) => typeof a === "number" ? a - b : String(a).localeCompare(String(b))) };
    const btxt = k => { const f = FD.find(x => x[0] === k); if (F[k].size === 1) return String(lab(k, [...F[k]][0])); return f[1] + (F[k].size ? " (" + F[k].size + ")" : "") };
    function syncModel() { if (!F.buyer.size || !F.model.size) return; const ok = new Set(R.filter(r => F.buyer.has(r.buyer)).map(r => r.model)); F.model = new Set([...F.model].filter(m => ok.has(m))) }
    const lab = (k, v) => k === "m" ? MN[v - 1] : v;
    function fbuild() {
      if (msg) { $("#fb").innerHTML = ""; return }
      const o = FD.slice(0, 1).concat(FD.slice(1, 2));
      const btn = f => `<div class="f"><button data-k="${f[0]}" class="${F[f[0]].size ? "on" : ""}" title="${esc(btxt(f[0]))}">${esc(btxt(f[0]))}</button></div>`;
      $("#fb").innerHTML = btn(FD[0]) + btn(FD[1]) + `<div class="f d"><span>From</span><input type="date" id="df" value="${from}"></div><div class="f d"><span>To</span><input type="date" id="dt" value="${to}"></div>` + FD.slice(2).map(btn).join("") + `<button class="rs" onclick="reset()">Reset</button>`;
      $("#fb").querySelectorAll("button[data-k]").forEach(b => b.onclick = e => { e.stopPropagation(); pnl(b) });
      $("#df").onchange = e => { from = e.target.value; draw() }; $("#dt").onchange = e => { to = e.target.value; draw() }
    }
    function pnl(b) {
      const k = b.dataset.k, p = $("#pn"), r = b.getBoundingClientRect(), L = opts(k);
      p.innerHTML = `<input type="text" placeholder="Search…"><div class="ls">${L.map(v => `<label><input type="checkbox" value="${esc(v)}" ${F[k].has(v) ? "checked" : ""}> ${esc(lab(k, v))}</label>`).join("")}</div><div class="ac"><button data-a="all">Select all</button><button data-a="clr">Clear</button></div>`;
      p.style.left = Math.min(r.left, innerWidth - 240) + "px"; p.style.top = r.bottom + 4 + "px"; p.style.display = "block";
      const upd = () => { fbuild(); draw() };
      p.querySelector("input[type=text]").oninput = e => p.querySelectorAll("label").forEach(l => l.style.display = l.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ? "" : "none");
      p.querySelectorAll(".ls input").forEach(c => c.onchange = () => { const v = typeof L[0] === "number" ? +c.value : c.value; c.checked ? F[k].add(v) : F[k].delete(v); b.textContent = btxt(k); b.title = btxt(k); b.classList.toggle("on", !!F[k].size); if (k === "buyer") { syncModel(); fbuild() } draw() });
      p.querySelectorAll(".ac button").forEach(x => x.onclick = () => { F[k] = new Set(x.dataset.a === "all" ? L : []); pnl(document.querySelector(`button[data-k=${k}]`) || b); b.textContent = btxt(k); b.title = btxt(k); b.classList.toggle("on", !!F[k].size); if (k === "buyer") { syncModel(); fbuild() } draw() })
    }
    function reset() { FD.forEach(f => F[f[0]] = new Set()); from = to = ""; fbuild(); draw() }

    const flt = () => R.filter(r => FD.every(f => !F[f[0]].size || F[f[0]].has(f[2](r))) && (!from || r.ds >= from) && (!to || r.ds <= to));
    const sumq = a => a.reduce((s, r) => s + r.q, 0);
    function grp(a, kf) { const m = new Map(); a.forEach(r => { const k = kf(r); m.set(k, (m.get(k) || 0) + r.q) }); return [...m].map(([k, q]) => ({ k, q })) }
    function show(p) { page = p; document.querySelectorAll(".nv[data-p]").forEach(n => n.classList.toggle("on", n.dataset.p === p)); draw() }
    function draw() {
      const c = $("#pgc"); if (msg) { c.innerHTML = `<div class="empty"><b>Finish Good</b>${esc(msg)}</div>`; return }
      const a = flt(); page === "ov" ? ov(a) : raw(a)
    }
    const CH = {}; function mk(id, cfg) { CH[id] && CH[id].destroy(); CH[id] = new Chart($("#" + id), cfg) }
    const PAL = ["#a61935", "#2b5bb8", "#e08a00", "#1f9d55", "#7c4dff", "#0b8aa6", "#d6336c", "#51607a"];
    function opt(leg, horiz) { return { responsive: true, maintainAspectRatio: false, indexAxis: horiz ? "y" : "x", plugins: { legend: { display: leg, position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { callbacks: { label: c => ` ${c.dataset.label ? c.dataset.label + ": " : ""}${n0(c.parsed[horiz ? "x" : "y"])}` } } }, scales: { [horiz ? "x" : "y"]: { beginAtZero: true, ticks: { callback: ab }, grid: { color: "#edf2fa" } }, [horiz ? "y" : "x"]: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 0, autoSkipPadding: 12, autoSkip: !horiz } } } } }

    const bpl = f => ({
      id: "bp", afterDatasetsDraw(ch) {
        const { ctx } = ch; ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "700 11px Inter,sans-serif";
        ch.data.datasets.forEach((ds, di) => ch.getDatasetMeta(di).data.forEach((b, i) => { const t = f(di, i); if (!t) return; const h = b.base - b.y; if (h >= 22) { ctx.fillStyle = "#fff"; ctx.fillText(t, b.x, b.y + 11) } else { ctx.fillStyle = "#0f2a5a"; ctx.fillText(t, b.x, b.y - 9) } })); ctx.restore()
      }
    });
    const pct1 = (v, t) => t && v ? (v / t * 100).toFixed(1) + "%" : "";
    const cards = a => rawCards(a); /* Overview = Raw Data-র মতো একই কার্ড */
    /* ---------- Month-wise Trend · premium card ---------- */
    let MTM = null;
    const MFN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const fmtM = v => { const x = Math.abs(v); return x >= 1e9 ? (v / 1e9).toFixed(1) + "B" : x >= 5e5 ? (v / 1e6).toFixed(1) + "M" : x >= 1e3 ? (v / 1e3).toFixed(0) + "K" : n0(v) };
    /* Month-wise Trend · one year + one month → that month day-wise · one year → Jan–Dec of that year */
    function periodOf(a) {
      const ys = [...F.y].map(Number), ms = [...F.m].map(Number);
      if (ys.length === 1 && ms.length === 1) return { mode: "day", y: ys[0], m: ms[0] };
      if (ys.length === 1) return { mode: "year", y: ys[0] };
      return null;
    }
    function mtPeriodHTML(a, per) {
      const now = new Date(), curK = now.getFullYear() * 100 + now.getMonth() + 1;
      const isDay = per.mode === "day";
      let mm, N, partial = false, pI, lab, short, xLabel = null, sub, span, unit, lastD = 0;
      if (isDay) {
        const dim = new Date(Date.UTC(per.y, per.m, 0)).getUTCDate(), rows = a.filter(r => r.y === per.y && r.m === per.m);
        const byD = new Map(); rows.forEach(r => byD.set(r.d, (byD.get(r.d) || 0) + r.q));
        lastD = rows.length ? Math.max(...rows.map(r => r.d)) : 0;
        mm = Array.from({ length: dim }, (_, i) => ({ k: i + 1, q: i + 1 <= lastD ? (byD.get(i + 1) || 0) : null }));
        N = dim; pI = -1;
        lab = k => `${MN[per.m - 1]} ${k}, ${per.y}`;
        short = k => `${k} ${MN[per.m - 1]}`;
        xLabel = i => (i % (N > 20 ? 2 : 1) === 0 ? String(i + 1) : "");
        const running = curK === per.y * 100 + per.m;
        sub = `Daily volume · ${MN[per.m - 1]} ${per.y}${running ? " (month is still running)" : ""}`;
        span = lastD ? `${MN[per.m - 1]} 1 – ${lastD}` : "—";
        unit = "production day";
      } else {
        const byM = new Map(); a.forEach(r => byM.set(r.m, (byM.get(r.m) || 0) + r.q));
        mm = Array.from({ length: 12 }, (_, i) => ({ k: per.y * 100 + i + 1, q: byM.has(i + 1) ? byM.get(i + 1) : null }));
        N = 12; pI = mm.findIndex(x => x.k === curK && x.q != null); partial = pI >= 0;
        if (!partial) pI = N - 1;
        lab = k => `${MN[k % 100 - 1]} ${Math.floor(k / 100)}`;
        short = k => MN[k % 100 - 1];
        xLabel = i => MN[i];
        sub = `Monthly volume · Jan ${per.y} – Dec ${per.y}${partial ? ` (${MFN[curK % 100 - 1]} is still running)` : ""}`;
        span = `Jan ${per.y} – Dec ${per.y}${partial ? " MTD" : ""}`;
        unit = "month";
      }
      const isPartialIdx = i => partial && i === pI;
      let grand = 0, pk = null, tr = null, fullIdx = [];
      mm.forEach((x, i) => {
        if (x.q == null) return;
        grand += x.q;
        if (isPartialIdx(i)) return;
        fullIdx.push(i);
        if (!pk || x.q > pk.q) pk = x; if (!tr || x.q < tr.q) tr = x;
      });
      const avg = fullIdx.length ? fullIdx.reduce((s, i) => s + mm[i].q, 0) / fullIdx.length : null;
      const bandFrom = fullIdx.length ? fullIdx[0] : -1, bandTo = fullIdx.length ? fullIdx[fullIdx.length - 1] : 0;
      const full = fullIdx.map(i => mm[i]);
      MTM = { mm, N, partial, pI, full, pk, tr, avg, bandFrom, bandTo, lab, short, avgLabel: isDay ? "Avg / day ≈" : "Avg / month ≈", xLabel, gridAt: () => false };
      const peakTxt = pk ? (isDay ? `${MN[per.m - 1]} ${pk.k}, ${per.y}` : lab(pk.k)) : "—";
      return `<div class="c mt"><div class="mt-h"><div><div class="mt-t">Month-wise Trend</div><div class="mt-s">${sub}</div></div>
<div class="mt-lg"><span><i></i>Actual</span>${partial ? '<span><i class="d"></i>Month to date</span>' : ""}</div></div>
<div class="mt-k"><div><small>Grand total</small><b>${n0(grand)}</b><span>${span}</span></div>
<div><small>Peak ${isDay ? "day" : "month"}</small><b>${pk ? fmtM(pk.q) : "—"}</b><span>${peakTxt}</span></div>
<div><small>Avg / ${isDay ? "day" : "month"} · ${isDay ? MN[per.m - 1] + " " + per.y : per.y}</small><b>${avg != null ? "≈" + fmtM(avg) : "—"}</b><span>${fullIdx.length} ${unit}${fullIdx.length === 1 ? "" : "s"} with data</span></div></div>
<div class="cv mt-cv"><canvas id="c1"></canvas></div></div>`;
    }
    function mtHTML(a) {
      if (!document.getElementById("mt-css")) {
        const s = document.createElement("style"); s.id = "mt-css";
        s.textContent = `
.c2f{display:flex;flex-direction:column}.c2f .cv{flex:1 1 0;height:auto;min-height:270px}
.c.mt .mt-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
.c.mt .mt-t{font-size:19px;font-weight:800;color:var(--navy);letter-spacing:-.01em;line-height:1.2}
.c.mt .mt-s{font-size:12px;color:var(--mute);margin-top:5px}
.c.mt .mt-lg{display:flex;gap:16px;font-size:12px;color:var(--mute);align-items:center;white-space:nowrap;padding-top:4px}
.c.mt .mt-lg i{display:inline-block;width:22px;height:0;border-top:3px solid #a61935;vertical-align:middle;margin-right:6px;border-radius:2px}
.c.mt .mt-lg i.d{border-top-style:dashed}
.c.mt .mt-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:14px 0 6px}
.c.mt .mt-k>div{background:#f5f7fb;border-radius:14px;padding:12px 14px;min-width:0}
.c.mt .mt-k small{display:block;font-size:10.5px;font-weight:700;letter-spacing:.07em;color:var(--mute);text-transform:uppercase}
.c.mt .mt-k b{display:block;font-size:clamp(20px,2vw,26px);font-weight:800;color:var(--navy);margin:6px 0 5px;letter-spacing:-.02em;line-height:1.1;white-space:nowrap}
.c.mt .mt-k span{font-size:12px;color:var(--mute)}
.c.mt .mt-k em{font-style:normal;display:inline-block;font-size:11.5px;font-weight:700;padding:3px 9px;border-radius:99px}
.c.mt .mt-k em.up{background:#e3f6ea;color:#14703e}.c.mt .mt-k em.dn{background:#fde8ea;color:#b3261e}
.c.mt .mt-cv{height:340px;margin-top:6px}`;
        document.head.appendChild(s);
      }
      const per = periodOf(a); if (per) return mtPeriodHTML(a, per);
      const mm = grp(a, r => r.y * 100 + r.m).sort((x, y) => x.k - y.k), N = mm.length;
      const now = new Date(), curK = now.getFullYear() * 100 + now.getMonth() + 1;
      const partial = N > 0 && mm[N - 1].k === curK, full = partial ? mm.slice(0, -1) : mm;
      const lab = k => MN[k % 100 - 1] + " " + Math.floor(k / 100), mi = k => Math.floor(k / 100) * 12 + (k % 100 - 1);
      let pk = null, tr = null; full.forEach(x => { if (!pk || x.q > pk.q) pk = x; if (!tr || x.q < tr.q) tr = x });
      let avg = null, delta = null, bandFrom = -1;
      if (full.length) {
        const li = mi(full[full.length - 1].k), win = full.filter(x => mi(x.k) > li - 12), pri = full.filter(x => mi(x.k) <= li - 12 && mi(x.k) > li - 24);
        const av = z => z.reduce((s, x) => s + x.q, 0) / z.length;
        avg = av(win); bandFrom = full.findIndex(x => mi(x.k) > li - 12);
        if (pri.length >= 6 && av(pri) > 0) delta = (avg / av(pri) - 1) * 100;
      }
      MTM = { mm, N, partial, pI: N - 1, full, pk, tr, avg, bandFrom, bandTo: full.length - 1, lab, short: k => MN[k % 100 - 1], avgLabel: "Last 12M avg ≈", xLabel: null, gridAt: null };
      const sub = N ? `Monthly volume · ${lab(mm[0].k)} – ${lab(mm[N - 1].k)}${partial ? ` (${MFN[mm[N - 1].k % 100 - 1]} is still running)` : ""}` : "No data for the selected filters";
      return `<div class="c mt"><div class="mt-h"><div><div class="mt-t">Month-wise Trend</div><div class="mt-s">${sub}</div></div>
<div class="mt-lg"><span><i></i>Actual</span>${partial ? '<span><i class="d"></i>Month to date</span>' : ""}</div></div>
<div class="mt-k"><div><small>Grand total</small><b>${n0(sumq(a))}</b><span>${N ? lab(mm[0].k) + " – " + lab(mm[N - 1].k) + (partial ? " MTD" : "") : "—"}</span></div>
<div><small>Peak month</small><b>${pk ? fmtM(pk.q) : "—"}</b><span>${pk ? lab(pk.k) : "—"}</span></div>
<div><small>Avg / month · last 12M</small><b>${avg != null ? "≈" + fmtM(avg) : "—"}</b>${delta != null ? `<em class="${delta >= 0 ? "up" : "dn"}">${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta).toFixed(1)}% vs prior 12M</em>` : `<span>${full.length ? "Last " + Math.min(12, full.length) + " months" : "—"}</span>`}</div></div>
<div class="cv mt-cv"><canvas id="c1"></canvas></div></div>`
    }
    function mtChart() {
      const { mm, N, partial, pI, full, pk, tr, avg, bandFrom, bandTo, lab, short, avgLabel, xLabel, gridAt } = MTM; if (!N) return;
      const yr = k => Math.floor(k / 100), yrIdx = new Set(); mm.forEach((x, i) => { if (!i || yr(x.k) !== yr(mm[i - 1].k)) yrIdx.add(i) });
      const gridOn = gridAt || (i => yrIdx.has(i)), xLab = xLabel || (i => yrIdx.has(i) ? String(yr(mm[i].k)) : "");
      const act = mm.map((x, i) => partial && i === pI ? null : x.q), mtd = mm.map((x, i) => partial && i >= pI - 1 && i <= pI ? x.q : null);
      const pkI = pk ? mm.findIndex(x => x.k === pk.k) : -1, trI = tr ? mm.findIndex(x => x.k === tr.k) : -1, mx = Math.max(...mm.map(x => x.q));
      const rr = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath() };
      const dot = (c, x, y, r, st) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.fillStyle = "#fff"; c.fill(); c.lineWidth = 2.5; c.strokeStyle = st; c.stroke() };
      const plug = {
        id: "mtx",
        beforeDatasetsDraw(ch) {
          const { ctx, chartArea: A, scales: { x } } = ch; if (bandFrom < 0 || avg == null) return;
          const st = N > 1 ? x.getPixelForValue(1) - x.getPixelForValue(0) : 0, x0 = Math.max(A.left, x.getPixelForValue(bandFrom) - st / 2), x1 = x.getPixelForValue(bandTo), ya = ch.scales.y.getPixelForValue(avg);
          ctx.save(); ctx.fillStyle = "rgba(166,25,53,.07)"; ctx.fillRect(x0, A.top, Math.max(0, x1 - x0), A.bottom - A.top);
          ctx.setLineDash([7, 6]); ctx.lineWidth = 2; ctx.strokeStyle = "#857b92"; ctx.beginPath(); ctx.moveTo(x0, ya); ctx.lineTo(x1, ya); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = "#0f2a5a"; ctx.font = "600 12px Inter,sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "alphabetic"; ctx.fillText(avgLabel + fmtM(avg), Math.min(A.right, x1 + 6), A.top - 10); ctx.restore()
        },
        afterDatasetsDraw(ch) {
          const { ctx, chartArea: A, scales: { x, y } } = ch; ctx.save();
          if (pk) {
            const px = x.getPixelForValue(pkI), py = y.getPixelForValue(pk.q);
            ctx.setLineDash([2, 4]); ctx.lineWidth = 1.5; ctx.strokeStyle = "#a79fb5"; ctx.beginPath(); ctx.moveTo(px, py + 8); ctx.lineTo(px, A.bottom); ctx.stroke(); ctx.setLineDash([]);
            dot(ctx, px, py, 7, "#a61935");
            const t = "Peak " + fmtM(pk.q) + " · " + lab(pk.k); ctx.font = "700 12.5px Inter,sans-serif"; const w = ctx.measureText(t).width + 26, h = 26;
            let bx = px - 16 - w, by = Math.max(A.top + 2, py - h / 2 - 6);
            if (bx < A.left) { bx = Math.min(Math.max(A.left, px - w / 2), A.right - w); by = Math.max(A.top - 30, py - h - 14) }
            ctx.fillStyle = "#0f2a5a"; rr(ctx, bx, by, w, h, 8); ctx.fill(); ctx.fillStyle = "#fff"; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillText(t, bx + 13, by + h / 2 + .5)
          }
          if (tr && trI !== pkI && full.length >= 4) {
            const px = x.getPixelForValue(trI), py = y.getPixelForValue(tr.q); dot(ctx, px, py, 6, "#4d566b");
            const t = lab(tr.k) + " · " + fmtM(tr.q); ctx.font = "500 12.5px Inter,sans-serif"; ctx.fillStyle = "#6d7c99"; ctx.textBaseline = "alphabetic";
            if (px + 14 + ctx.measureText(t).width > A.right) { ctx.textAlign = "right"; ctx.fillText(t, px - 12, py - 10) } else { ctx.textAlign = "left"; ctx.fillText(t, px + 12, py - 10) }
          }
          if (partial) {
            const px = x.getPixelForValue(pI), py = y.getPixelForValue(mm[pI].q), t = short(mm[pI].k) + " MTD · " + fmtM(mm[N - 1].q) + " · partial";
            ctx.font = "600 12.5px Inter,sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.lineJoin = "round"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(255,255,255,.92)"; ctx.strokeText(t, px - 14, py); ctx.fillStyle = "#0f2a5a"; ctx.fillText(t, px - 14, py)
          }
          ctx.restore()
        }
      };
      mk("c1", {
        type: "line",
        data: {
          labels: mm.map(x => lab(x.k)), datasets: [
            { label: "Actual", data: act, borderColor: "#a61935", borderWidth: 3, tension: 0, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: "#fff", pointHoverBorderColor: "#a61935", pointHoverBorderWidth: 2, fill: true, spanGaps: false, backgroundColor: c => { const a = c.chart.chartArea; if (!a) return "rgba(166,25,53,.10)"; const g = c.chart.ctx.createLinearGradient(0, a.top, 0, a.bottom); g.addColorStop(0, "rgba(166,25,53,.20)"); g.addColorStop(1, "rgba(166,25,53,.01)"); return g } },
            { label: "Month to date", data: mtd, borderColor: "#a61935", borderWidth: 2.5, borderDash: [3, 5], borderCapStyle: "round", tension: 0, fill: false, spanGaps: true, pointRadius: c => c.dataIndex === pI ? 6 : 0, pointBackgroundColor: "#fff", pointBorderColor: "#a61935", pointBorderWidth: 2.5 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { top: 34, right: 14 } }, interaction: { mode: "index", intersect: false },
          plugins: { legend: { display: false }, tooltip: { filter: it => it.raw != null && (it.datasetIndex === 0 || it.dataIndex === pI), callbacks: { title: it => lab(mm[it[0].dataIndex].k) + (partial && it[0].dataIndex === pI ? " (month to date)" : ""), label: c => " " + n0(c.parsed.y) } } },
          scales: {
            x: { grid: { color: c => gridOn(c.index) ? "#ebe6ef" : "transparent", drawTicks: false }, border: { display: false }, ticks: { autoSkip: false, maxRotation: 0, color: "#6d7c99", font: { size: 12 }, callback: (v, i) => xLab(i) } },
            y: { beginAtZero: true, suggestedMax: mx * 1.12, grid: { color: "#ece8f0" }, border: { display: false }, ticks: { callback: v => ab(v), color: "#6d7c99", font: { size: 12 }, maxTicksLimit: 6 } }
          }
        }, plugins: [plug]
      })
    }


    /* ---------- Year-to-Year Trend · premium card (best year = green, running year = hatched) ---------- */
    let YTM = null;
    const YT_GREEN = "#1f9d55", YT_GREY = "#c9cfdd", YT_RED = "#a61935";
    function ytHTML(a) {
      if (!document.getElementById("yt-css")) {
        const st = document.createElement("style"); st.id = "yt-css";
        st.textContent = `
.c.yt{display:flex;flex-direction:column}
.c.yt .yt-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
.c.yt .yt-t{font-size:19px;font-weight:800;color:var(--navy);letter-spacing:-.01em;line-height:1.2}
.c.yt .yt-s{font-size:12px;color:var(--mute);margin-top:5px}
.c.yt .yt-lg{display:flex;gap:14px;font-size:12px;color:var(--mute);align-items:center;white-space:nowrap;padding-top:4px;flex-wrap:wrap}
.c.yt .yt-lg i{display:inline-block;width:12px;height:12px;border-radius:4px;vertical-align:middle;margin-right:6px}
.c.yt .yt-lg i.b{background:${YT_GREEN}}.c.yt .yt-lg i.o{background:${YT_GREY}}
.c.yt .yt-lg i.y{background:repeating-linear-gradient(135deg,#f3c9d2 0 3px,#fff 3px 6px);border:1.5px dashed ${YT_RED}}
.c.yt .yt-p{background:#f5f7fb;border-radius:16px;padding:14px 16px;margin:14px 0 8px}
.c.yt .yt-r{display:flex;justify-content:space-between;align-items:flex-end;gap:16px 24px;flex-wrap:wrap}
.c.yt .yt-r small{display:block;font-size:10.5px;font-weight:700;letter-spacing:.08em;color:var(--mute);text-transform:uppercase}
.c.yt .yt-big{font-size:clamp(20px,2vw,26px);font-weight:800;color:var(--navy);letter-spacing:-.02em;line-height:1.1;margin-top:6px;white-space:nowrap}
.c.yt .yt-md{font-size:clamp(20px,2vw,28px);font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-top:5px;white-space:nowrap;color:var(--navy)}
.c.yt .yt-md.g{color:${YT_GREEN}}.c.yt .yt-md span{font-size:12.5px;font-weight:600;color:var(--mute);letter-spacing:0;margin-left:6px}
.c.yt .yt-sp{border-left:1px solid #dfe5f0;padding-left:20px}
.c.yt .yt-tl{display:flex;gap:6px;margin-top:12px}
.c.yt .yt-tl div{min-width:0;flex:1 1 0;text-align:center;font-size:12px;font-weight:700;padding:9px 2px;border-radius:9px;background:${YT_GREY};color:var(--navy)}
.c.yt .yt-tl div.b{background:${YT_GREEN};color:#fff}
.c.yt .yt-tl div.y{background:repeating-linear-gradient(135deg,#f6d9df 0 4px,#fff 4px 8px);border:1.5px dashed ${YT_RED};color:var(--navy)}
.c.yt .yt-cv{position:relative;flex:1 1 0;min-height:300px;margin-top:6px}`;
        document.head.appendChild(st);
      }
      const yy = grp(a, r => r.y).sort((x, y) => x.k - y.k), N = yy.length, T = yy.reduce((s, x) => s + x.q, 0);
      const partial = N > 0 && yy[N - 1].k === new Date().getFullYear(), full = partial ? yy.slice(0, -1) : yy;
      let best = null; full.forEach(x => { if (!best || x.q > best.q) best = x });
      const avg = full.length ? full.reduce((s, x) => s + x.q, 0) / full.length : null;
      const P = v => T ? (v / T * 100).toFixed(1) + "%" : "0%";
      YTM = { yy, N, T, partial, full, best, avg };
      if (!N) return `<div class="c yt"><div class="yt-t">Year-to-Year Trend</div><div class="yt-s">No data for the selected filters</div></div>`;
      const cur = partial ? yy[N - 1] : null, rng = yy[0].k + (N > 1 ? " – " + yy[N - 1].k + (partial ? " YTD" : "") : (partial ? " YTD" : ""));
      const right = (best ? `<div><small>Best year</small><div class="yt-md g">${best.k}<span>${P(best.q)} · ${fmtM(best.q)}</span></div></div>` : "")
        + (cur ? `<div class="yt-sp"><small>${cur.k} · year still running</small><div class="yt-md">${P(cur.q)}<span>${fmtM(cur.q)} so far</span></div></div>`
          : (avg != null && full.length > 1 ? `<div class="yt-sp"><small>Avg / year</small><div class="yt-md">${fmtM(avg)}</div></div>` : ""));
      return `<div class="c yt"><div class="yt-h"><div><div class="yt-t">Year-to-Year Trend</div><div class="yt-s">% on each bar = that year's contribution to the grand total</div></div>
<div class="yt-lg"><span><i class="b"></i>Best year</span><span><i class="o"></i>Other years</span>${partial ? '<span><i class="y"></i>Year to date</span>' : ""}</div></div>
<div class="yt-p"><div class="yt-r"><div><small>Grand total · ${rng}</small><div class="yt-big">${n0(T)}</div></div>${right}</div>
<div class="yt-tl">${yy.map(x => `<div class="${best && x.k === best.k ? "b" : partial && x.k === cur.k ? "y" : ""}" style="flex-grow:${Math.max(.6, x.q / T * N)}">${x.k}</div>`).join("")}</div></div>
<div class="yt-cv"><canvas id="c2"></canvas></div></div>`
    }
    /* ---------- Year-to-Year hover · 12-month breakdown panel (like the Top-10 model panel) ---------- */
    let YTA = [];
    const YTS = {
      ht: 0, over: false, k: null,
      hide() { clearTimeout(this.ht); this.over = false; this.k = null; const t = document.getElementById("yt-tip"), s = document.getElementById("yt-side"); if (t) t.style.display = "none"; if (s) s.style.display = "none" },
      soon() { clearTimeout(this.ht); this.ht = setTimeout(() => { if (!YTS.over) YTS.hide() }, 160) }
    };
    if (!document.getElementById("yt-tip-css")) {
      const st = document.createElement("style"); st.id = "yt-tip-css";
      st.textContent = `#yt-tip{position:fixed;z-index:9999;pointer-events:auto;display:none;width:280px;background:#fff;border-radius:12px;padding:12px 14px;box-shadow:0 10px 30px rgba(15,42,90,.22);border:1px solid #e3e8f2;font-family:Inter,sans-serif}
#yt-tip .h{font-size:14px;font-weight:800;color:#0f2a5a;line-height:1.3}#yt-tip .h span{display:block;font-size:12px;font-weight:600;color:#6d7c99;margin-top:2px}
#yt-tip .by{font-size:10.5px;font-weight:700;letter-spacing:.08em;color:#6d7c99;margin:10px 0 4px;text-transform:uppercase}
#yt-tip .r{display:grid;grid-template-columns:40px 1fr 56px;align-items:center;gap:8px;margin:5px 0;font-size:12.5px}
#yt-tip .r em{font-style:normal;color:#0b5fa5;font-weight:600}
#yt-tip .r u{display:block;height:8px;border-radius:9px;background:#e8ecf3;text-decoration:none;overflow:hidden}
#yt-tip .r u i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#0a84c6,#00bcd4)}
#yt-tip .r b{text-align:right;color:#0f2a5a;font-weight:800}
#yt-tip .r.z b{color:#9aa3b8;font-weight:600}
#yt-tip .r[data-m]{padding:3px 4px;margin:2px -4px;border-radius:7px;cursor:default}
#yt-tip .r[data-m]:hover{background:#eaf3fb}
#yt-side{position:fixed;z-index:10000;pointer-events:none;display:none;width:360px;background:#fff;border-radius:12px;padding:12px 14px;box-shadow:0 10px 30px rgba(15,42,90,.22);border:1px solid #e3e8f2;font-family:Inter,sans-serif}
#yt-side .h{font-size:15px;font-weight:800;color:#0f2a5a;line-height:1.3}#yt-side .h span{display:block;font-size:12px;font-weight:600;color:#6d7c99;margin-top:2px}
#yt-side .by{font-size:10.5px;font-weight:700;letter-spacing:.08em;color:#6d7c99;margin:10px 0 6px;text-transform:uppercase}
#yt-side .r{display:grid;grid-template-columns:70px 1fr 58px;align-items:center;gap:8px;margin:6px 0;font-size:12.5px}
#yt-side .r em{font-style:normal;color:#0b5fa5;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#yt-side .bb{min-width:0}#yt-side .bb span{display:block;font-size:11px;font-weight:600;color:#44557a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px}
#yt-side .bb span small{color:#6d7c99;font-weight:700;margin-left:4px}
#yt-side .bb u{display:block;height:6px;border-radius:9px;background:#e8ecf3;text-decoration:none;overflow:hidden}
#yt-side .bb u i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#0a84c6,#00bcd4)}
#yt-side .r b{text-align:right;color:#0f2a5a;font-weight:800}
#yt-side .none{font-size:12.5px;color:#6d7c99;padding:8px 0}`;
      document.head.appendChild(st);
      const d = document.createElement("div"); d.id = "yt-tip"; document.body.appendChild(d);
      const sd = document.createElement("div"); sd.id = "yt-side"; document.body.appendChild(sd);
      d.onmouseenter = () => { clearTimeout(YTS.ht); YTS.over = true };
      d.onmouseleave = () => { YTS.over = false; sd.style.display = "none"; YTS.soon() };
      d.onmousemove = e => {
        const r = e.target.closest(".r[data-m]"); if (!r) { sd.style.display = "none"; return }
        const y = +r.dataset.y, m = +r.dataset.m, id = y * 100 + m;
        if (YTS.k !== id) {
          const mp = new Map(); let tot = 0;
          YTA.forEach(x => {
            if (x.y !== y || x.m !== m || !(x.q > 0)) return;
            const k = x.model || "N/A"; let o = mp.get(k); if (!o) mp.set(k, o = { k, q: 0, b: new Map() });
            o.q += x.q; tot += x.q; const by = x.buyer || "N/A"; o.b.set(by, (o.b.get(by) || 0) + x.q)
          });
          const L = [...mp.values()].sort((p, q) => q.q - p.q), top = L.slice(0, 10), mx = top.length ? top[0].q : 1;
          sd.innerHTML = `<div class="h">${MN[m - 1]} ${y}<span>${hxF(tot)} · ${L.length} models</span></div>` + (top.length ? `<div class="by">By model · Top ${top.length} · buyer &amp; value</div>` + top.map(x => {
            const bs = [...x.b].sort((p, q) => q[1] - p[1]), more = bs.length - 1;
            return `<div class="r"><em title="${esc(x.k)}">${esc(x.k)}</em><div class="bb"><span>${esc(bs[0][0])}${more > 0 ? `<small>+${more}</small>` : ""}</span><u><i style="width:${(x.q / mx * 100).toFixed(1)}%"></i></u></div><b>${hxF(x.q)}</b></div>`
          }).join("") : `<div class="none">No model data for this month</div>`);
          YTS.k = id
        }
        sd.style.display = "block"; const tr = d.getBoundingClientRect();
        let l = tr.right + 2; if (l + sd.offsetWidth > innerWidth - 8) l = tr.left - sd.offsetWidth - 2;
        let t = tr.top; if (t + sd.offsetHeight > innerHeight - 8) t = innerHeight - sd.offsetHeight - 8;
        sd.style.left = Math.max(8, l) + "px"; sd.style.top = Math.max(8, t) + "px"
      };
    }
    function ytExt(c) {
      const tp = document.getElementById("yt-tip"), t = c.tooltip;
      if (!t || t.opacity === 0 || !t.dataPoints || !t.dataPoints.length || !YTM || !YTM.yy) { YTS.soon(); return }
      clearTimeout(YTS.ht);
      const i = t.dataPoints[0].dataIndex, row = YTM.yy[i], y = row.k;
      const ms = MN.map((mn, m) => { let q = 0; YTA.forEach(r => { if (r.y === y && r.m === m + 1) q += r.q }); return { k: mn, q } });
      const mx = Math.max(...ms.map(x => x.q), 1);
      const html = `<div class="h">${y}<span>${fmtM(row.q)} · ${YTM.T ? (row.q / YTM.T * 100).toFixed(1) : "0.0"}% of total</span></div><div class="by">By month · 12 months</div>` +
        ms.map((x, m) => `<div class="r${x.q ? "" : " z"}"${x.q ? ` data-y="${y}" data-m="${m + 1}"` : ""}><em>${x.k}</em><u><i style="width:${(x.q / mx * 100).toFixed(1)}%"></i></u><b>${x.q ? fmtM(x.q) : "–"}</b></div>`).join("");
      if (tp._h !== html) { tp.innerHTML = html; tp._h = html; YTS.k = null; const sd = document.getElementById("yt-side"); if (sd) sd.style.display = "none" }
      tp.style.display = "block";
      const R = c.chart.canvas.getBoundingClientRect(), b = c.chart.getDatasetMeta(0).data[i], cx = R.left + b.x, hw = (b.width || 80) / 2;
      let x = cx + hw + 2, yy = R.top + t.caretY - 20;
      if (x + tp.offsetWidth > innerWidth - 8) x = cx - hw - 2 - tp.offsetWidth;
      if (yy + tp.offsetHeight > innerHeight - 8) yy = innerHeight - tp.offsetHeight - 8;
      tp.style.left = Math.max(8, x) + "px"; tp.style.top = Math.max(8, yy) + "px";
    }
    function ytChart() {
      const { yy, N, T, partial, full, best, avg } = YTM; if (!N) return;
      const mx = Math.max(...yy.map(x => x.q)), P = v => T ? (v / T * 100).toFixed(1) + "%" : "0%";
      const isB = i => best && yy[i].k === best.k, isY = i => partial && i === N - 1;
      const pat = (() => { const c = document.createElement("canvas"); c.width = c.height = 12; const g = c.getContext("2d"); g.fillStyle = "#fbe4e9"; g.fillRect(0, 0, 12, 12); g.strokeStyle = "#efb5c1"; g.lineWidth = 3; g.beginPath(); g.moveTo(-2, 14); g.lineTo(14, -2); g.moveTo(-2, 2); g.lineTo(2, -2); g.moveTo(10, 14); g.lineTo(14, 10); g.stroke(); return c })();
      const bg = yy.map((x, i) => isY(i) ? document.createElement("canvas").getContext("2d").createPattern(pat, "repeat") : isB(i) ? YT_GREEN : YT_GREY);
      const pill = (c, x, y, t, fg, bgc) => { c.font = "700 13px Inter,sans-serif"; const w = c.measureText(t).width + 22, h = 24; c.fillStyle = bgc; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 12); c.fill(); c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(t, x, y + .5) };
      const plug = {
        id: "ytx",
        beforeDatasetsDraw(ch) {
          if (avg == null || full.length < 2) return; const { ctx, chartArea: A, scales: { y } } = ch, ya = y.getPixelForValue(avg);
          ctx.save(); ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeStyle = "#9aa3b8"; ctx.beginPath(); ctx.moveTo(A.left, ya); ctx.lineTo(A.right, ya); ctx.stroke(); ctx.restore()
        },
        afterDatasetsDraw(ch) {
          const { ctx, chartArea: A, scales: { y } } = ch; ctx.save();
          ch.getDatasetMeta(0).data.forEach((b, i) => {
            const h = b.base - b.y, v = yy[i].q, pc = P(v);
            ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#0f2a5a"; ctx.font = "500 12px Inter,sans-serif";
            if (h >= 34) { ctx.fillText(fmtM(v), b.x, b.y - 7); ctx.textBaseline = "middle"; ctx.font = "700 12px Inter,sans-serif"; ctx.fillStyle = isB(i) ? "#fff" : "#0f2a5a"; ctx.fillText(pc, b.x, b.y + 16) }
            else { ctx.font = "700 11.5px Inter,sans-serif"; ctx.fillText(pc, b.x, b.y - 7); ctx.font = "500 12px Inter,sans-serif"; ctx.fillText(fmtM(v), b.x, b.y - 21) }
            const t = Math.max(0, i), top = ch.height - 20;
            if (i === 0) pill(ctx, b.x, top, "—", "#6d7c99", "#eef1f7");
            else if (isY(i)) pill(ctx, b.x, top, "YTD", YT_RED, "#fbdde3");
            else { const pv = yy[i - 1].q, d = pv ? (v / pv - 1) * 100 : 0, up = d >= 0; pill(ctx, b.x, top, (up ? "▲ " : "▼ ") + Math.abs(d).toFixed(0) + "%", up ? "#14703e" : "#b3261e", up ? "#e3f6ea" : "#fde8ea") }
          });
          if (avg != null && full.length > 1) { const ya = y.getPixelForValue(avg); ctx.font = "700 12.5px Inter,sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.lineJoin = "round"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(255,255,255,.9)"; const t = "Avg full year " + fmtM(avg); ctx.strokeText(t, A.left + 2, ya - 7); ctx.fillStyle = "#0f2a5a"; ctx.fillText(t, A.left + 2, ya - 7) }
          ctx.restore()
        }
      };
      mk("c2", {
        type: "bar",
        data: { labels: yy.map(x => x.k), datasets: [{ label: "Total Qty", data: yy.map(x => x.q), backgroundColor: bg, borderRadius: 8, borderSkipped: false, borderColor: YT_RED, borderDash: [5, 4], borderWidth: yy.map((x, i) => isY(i) ? 2 : 0), maxBarThickness: 120 }] },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { top: 24, bottom: 36 } },
          interaction: { mode: "index", intersect: false },
          plugins: { legend: { display: false }, tooltip: { enabled: false, external: ytExt } },
          scales: { x: { grid: { display: false }, border: { color: "#d9dfec" }, ticks: { color: "#0f2a5a", font: { size: 14, weight: "700" }, padding: 8 } }, y: { display: false, beginAtZero: true, suggestedMax: mx * 1.08 } }
        }, plugins: [plug]
      })
    }


    /* ---------- Year & Month wise Heatmap · premium card ---------- */
    const HX_BIN = ["#c8303f", "#f4b6bd", "#eef1f7", "#bfe6cb", "#50b078", "#127d45"], HX_TX = ["#fff", "#0f2a5a", "#0f2a5a", "#0f2a5a", "#0f2a5a", "#fff"];
    /* ---------- Heatmap month hover · Top 10 models of that month (like the "By model · Top 10" panel) ---------- */
    let HXM = new Map();
    const hxF = v => { const x = Math.abs(v); return x >= 1e9 ? (v / 1e9).toFixed(2) + "B" : x >= 1e6 ? (v / 1e6).toFixed(2) + "M" : x >= 1e3 ? Math.round(v / 1e3) + "K" : n0(v) };
    if (!document.getElementById("hx-pan-css")) {
      const st = document.createElement("style"); st.id = "hx-pan-css";
      st.textContent = `#hx-pan{position:fixed;z-index:9999;pointer-events:none;display:none;width:300px;background:#fff;border-radius:12px;padding:12px 14px;box-shadow:0 10px 30px rgba(15,42,90,.22);border:1px solid #e3e8f2;font-family:Inter,sans-serif}
#hx-pan .h{font-size:14px;font-weight:800;color:#0f2a5a;line-height:1.3}#hx-pan .h span{display:block;font-size:12px;font-weight:600;color:#6d7c99;margin-top:2px}
#hx-pan .by{font-size:10.5px;font-weight:700;letter-spacing:.08em;color:#6d7c99;margin:10px 0 4px;text-transform:uppercase}
#hx-pan .r{display:grid;grid-template-columns:92px 1fr 62px;align-items:center;gap:8px;margin:5px 0;font-size:12.5px}
#hx-pan .r em{font-style:normal;color:#0b5fa5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}
#hx-pan .r u{display:block;height:8px;border-radius:9px;background:#e8ecf3;text-decoration:none;overflow:hidden}
#hx-pan .r u i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#0a84c6,#00bcd4)}
#hx-pan .r b{text-align:right;color:#0f2a5a;font-weight:800}
#hx-pan .none{font-size:12.5px;color:#6d7c99;padding:8px 0}`;
      document.head.appendChild(st);
      const d = document.createElement("div"); d.id = "hx-pan"; document.body.appendChild(d);
    }
    function hxPanel(k, e) {
      const tp = document.getElementById("hx-pan"), y = Math.floor(k / 100), m = k % 100;
      const M = HXM.get(k) || new Map();
      const tot = [...M.values()].reduce((s, x) => s + x, 0);
      const L = [...M].map(([n, q]) => ({ k: n || "N/A", q })).sort((x, z) => z.q - x.q).slice(0, 10);
      const mx = L.length ? L[0].q : 1;
      tp.innerHTML = `<div class="h">${MN[m - 1]} ${y}<span>${hxF(tot)} · ${M.size} models</span></div>` +
        (L.length ? `<div class="by">By model · Top ${L.length}</div>` + L.map(x => `<div class="r"><em title="${esc(x.k)}">${esc(x.k)}</em><u><i style="width:${(x.q / mx * 100).toFixed(1)}%"></i></u><b>${hxF(x.q)}</b></div>`).join("")
          : `<div class="none">No model data for this month</div>`);
      tp.style.display = "block";
      let x = e.clientX + 16, yy = e.clientY - 20;
      if (x + tp.offsetWidth > innerWidth - 8) x = e.clientX - tp.offsetWidth - 16;
      if (yy + tp.offsetHeight > innerHeight - 8) yy = innerHeight - tp.offsetHeight - 8;
      tp.style.left = Math.max(8, x) + "px"; tp.style.top = Math.max(8, yy) + "px";
    }
    function hidePanels() { const a1 = document.getElementById("hx-pan"), a2 = document.getElementById("hx-tip"); if (a1) a1.style.display = "none"; if (a2) a2.style.display = "none" }
    function hmRender(a) {
      const box = document.getElementById("hmc"); if (!box) return;
      HXM = new Map(); a.forEach(r => { const k = r.y * 100 + r.m; let mm = HXM.get(k); if (!mm) HXM.set(k, mm = new Map()); mm.set(r.model, (mm.get(r.model) || 0) + r.q) });
      if (!document.getElementById("hx-css")) {
        const st = document.createElement("style"); st.id = "hx-css";
        st.textContent = `
.hxc .hx-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
.hxc .hx-t{font-size:19px;font-weight:800;color:var(--navy);letter-spacing:-.01em;line-height:1.2}
.hxc .hx-s{font-size:12px;color:var(--mute);margin-top:5px}
.hxc .hx-lg{display:flex;gap:12px;font-size:12px;color:var(--mute);align-items:center;flex-wrap:wrap;padding-top:4px}
.hxc .hx-lg i{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:middle;margin-right:5px}
.hxc .hx-k{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:12px;margin:14px 0}
.hxc .hx-k>div{background:#f5f7fb;border-radius:14px;padding:12px 16px;min-width:0}
.hxc .hx-k small{display:block;font-size:10.5px;font-weight:700;letter-spacing:.08em;color:var(--mute);text-transform:uppercase}
.hxc .hx-k b{display:block;font-size:clamp(20px,2vw,28px);font-weight:800;color:var(--navy);margin:6px 0 4px;letter-spacing:-.02em;line-height:1.1;white-space:nowrap}
.hxc .hx-k span{font-size:12px;color:var(--mute)}
.hxc .hx-w{overflow-x:auto;padding:5px 4px 2px}
.hxc .hx-g{display:grid;grid-template-columns:64px repeat(12,minmax(54px,1fr)) 150px;gap:6px;min-width:960px;align-items:stretch}
.hxc .hx-hd{text-align:center;font-size:12.5px;color:var(--mute);font-weight:500;padding:4px 0}
.hxc .hx-y{display:flex;flex-direction:column;justify-content:center;font-size:16px;font-weight:800;color:var(--navy)}
.hxc .hx-y small{font-size:10.5px;font-weight:800;color:${YT_GREEN};letter-spacing:.06em}
.hxc .hx-c{position:relative;height:52px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:15px;font-weight:700;cursor:default;line-height:1.1}
.hxc .hx-c em{font-style:normal;font-size:10px;font-weight:800;letter-spacing:.08em;margin-top:2px}
.hxc .hx-c.pk,.hxc .hx-c.lw{box-shadow:0 0 0 2px #fff,0 0 0 4px var(--navy)}
.hxc .hx-c.run{background:repeating-linear-gradient(135deg,#dfe5f1 0 4px,#f6f8fc 4px 8px);border:1.5px dashed #8d9ab5;color:var(--navy)}
.hxc .hx-c.no{background:#fafbfd;border:1.5px dashed #d5dbe8;color:var(--mute)}
.hxc .hx-c:hover{filter:brightness(.95)}
.hxc .hx-tt{background:#f5f7fb;border-radius:10px;padding:7px 10px;display:flex;flex-direction:column;justify-content:center;gap:5px;cursor:default}
.hxc .hx-tt div{display:flex;justify-content:space-between;align-items:baseline;gap:6px}
.hxc .hx-tt b{font-size:14px;color:var(--navy);font-weight:800}.hxc .hx-tt span{font-size:11.5px;color:var(--mute)}
.hxc .hx-tt u{display:block;height:5px;border-radius:9px;background:#e3e8f2;text-decoration:none;overflow:hidden}
.hxc .hx-tt u i{display:block;height:100%;background:var(--navy);border-radius:9px}
.hxc .hx-tt u i.r{background:repeating-linear-gradient(135deg,${YT_GREEN} 0 4px,#9fd8b8 4px 8px)}
.hxc .hx-av{text-align:center;padding-top:10px;font-size:14px;font-weight:700;color:var(--navy)}
.hxc .hx-av span{display:inline-block;padding:6px 14px;border-radius:99px;background:#f1f4fa}
.hxc .hx-av span.hi{background:var(--navy);color:#fff}.hxc .hx-av span.lo{background:#fff;border:1.5px solid var(--navy)}
.hxc .hx-av small{display:block;font-size:10.5px;font-weight:800;letter-spacing:.06em;color:var(--mute);margin-top:3px}
.hxc .hx-gt{background:var(--navy);color:#fff;border-radius:12px;padding:10px 12px;margin-top:8px}
.hxc .hx-gt b{display:block;font-size:16px}.hxc .hx-gt small{font-size:9.5px;font-weight:700;letter-spacing:.06em}
.hxc .hx-ft{display:flex;gap:18px;flex-wrap:wrap;font-size:12px;color:var(--mute);margin-top:14px;align-items:center}
.hxc .hx-ft i{display:inline-block;width:18px;height:14px;border-radius:4px;vertical-align:middle;margin-right:6px}
.hxc.cmp .hx-k{margin:10px 0}.hxc.cmp .hx-k>div{padding:10px 14px}.hxc.cmp .hx-k b{font-size:clamp(20px,1.9vw,25px);margin:4px 0 3px}
.hxc.cmp .hx-g{gap:5px}.hxc.cmp .hx-hd{padding:2px 0}.hxc.cmp .hx-y{font-size:15px}
.hxc.cmp .hx-c{height:40px;font-size:14px;border-radius:9px}.hxc.cmp .hx-c em{font-size:9px;margin-top:1px}
.hxc.cmp .hx-c.pk,.hxc.cmp .hx-c.lw{box-shadow:0 0 0 1.5px #fff,0 0 0 3.5px var(--navy)}
.hxc.cmp .hx-tt{padding:4px 10px;gap:4px}.hxc.cmp .hx-tt b{font-size:13.5px}
.hxc.cmp .hx-av{padding-top:6px}.hxc.cmp .hx-av span{padding:4px 12px}
.hxc.cmp .hx-gt{margin-top:4px;padding:7px 10px}.hxc.cmp .hx-ft{margin-top:10px}
#hx-tip{position:fixed;z-index:9999;pointer-events:none;background:var(--navy);color:#fff;padding:7px 11px;border-radius:9px;font-size:12.5px;box-shadow:0 6px 18px rgba(15,42,90,.3);display:none;white-space:nowrap}
#hx-tip b{font-size:14px;margin-left:6px}
@media(max-width:900px){.hxc .hx-k{grid-template-columns:1fr}}`;
        document.head.appendChild(st);
        const tp = document.createElement("div"); tp.id = "hx-tip"; document.body.appendChild(tp);
      }
      const g = new Map(); a.forEach(r => { const q = r.y * 100 + r.m; g.set(q, (g.get(q) || 0) + r.q) });
      const Ys = [...new Set(a.map(r => r.y))].sort((x, y) => x - y), T = sumq(a);
      if (!Ys.length || !T) { box.innerHTML = `<div class="hx-t">Year &amp; Month wise Heatmap</div><div class="hx-s">No data for the selected filters</div>`; return }
      const now = new Date(), cY = now.getFullYear(), cM = now.getMonth() + 1, cD = now.getDate();
      const V = (y, m) => g.get(y * 100 + m) || 0, run = (y, m) => y === cY && m === cM && V(y, m) > 0;
      const fullM = []; Ys.forEach(y => { for (let m = 1; m <= 12; m++) { const v = V(y, m); if (v > 0 && !run(y, m)) fullM.push({ y, m, v }) } });
      const srt = fullM.map(x => x.v).sort((x, y) => x - y), med = srt.length ? srt[Math.floor(srt.length / 2)] : T;
      const UN = med >= 1e6 ? ["M", 1e6] : ["K", 1e3], dec = med / UN[1] >= 10 ? 0 : 1;
      const th = [.6, .82, .97, 1.09, 1.21].map(r => +(med * r / UN[1]).toFixed(dec));
      const bin = v => { const x = v / UN[1]; let b = 0; while (b < 5 && x >= th[b]) b++; return b };
      const f1 = v => (v / UN[1]).toFixed(1), fu = v => f1(v) + UN[0];
      const tf = x => x.toFixed(dec), lg = [`&lt;${tf(th[0])}`, `${tf(th[0])}–${tf(th[1])}`, `${tf(th[1])}–${tf(th[2])}`, `${tf(th[2])}–${tf(th[3])}`, `${tf(th[3])}–${tf(th[4])}`, `${tf(th[4])}+`];
      let pk = null, lw = null; if (fullM.length > 1) fullM.forEach(x => { if (!pk || x.v > pk.v) pk = x; if (!lw || x.v < lw.v) lw = x });
      /* calendar-month averages over the full years (the first, start-up year is left out when enough years exist) */
      let fy = Ys.filter(y => y < cY && Array.from({ length: 12 }, (_, i) => V(y, i + 1)).every(v => v > 0)); if (fy.length >= 3 && fy[0] === Ys[0]) fy = fy.slice(1);
      let av = null, hi = -1, lo = -1;
      if (fy.length) { av = Array.from({ length: 12 }, (_, i) => fy.reduce((s, y) => s + V(y, i + 1), 0) / fy.length); av.forEach((v, i) => { if (hi < 0 || v > av[hi]) hi = i; if (lo < 0 || v < av[lo]) lo = i }) }
      const first = Ys[0], lastY = Ys[Ys.length - 1]; let lastM = 12; while (lastM > 1 && !V(lastY, lastM)) lastM--;
      let firstM = 1; while (firstM < 12 && !V(first, firstM)) firstM++;
      const partial = run(lastY, lastM), yt = Ys.map(y => { let t = 0; for (let m = 1; m <= 12; m++) t += V(y, m); return t }), mxY = Math.max(...yt);
      const unL = UN[0] === "M" ? "millions (M)" : "thousands (K)";
      const rows = Ys.map((y, yi) => {
        const cells = MN.map((_, i) => {
          const m = i + 1, v = V(y, m), tip = `${MN[i]} ${y}|${n0(v)}`;
          if (v <= 0) return `<div class="hx-c no">–</div>`;
          if (run(y, m)) return `<div class="hx-c run" data-t="${tip}" data-k="${y * 100 + m}">${f1(v)}<em>MTD</em></div>`;
          const b = bin(v), isP = pk && pk.y === y && pk.m === m, isL = lw && lw.y === y && lw.m === m;
          return `<div class="hx-c ${isP ? "pk" : ""} ${isL ? "lw" : ""}" style="background:${HX_BIN[b]};color:${HX_TX[b]}" data-t="${tip}" data-k="${y * 100 + m}">${f1(v)}${isP ? "<em>PEAK</em>" : isL ? "<em>LOW</em>" : ""}</div>`
        }).join("");
        const isRun = y === cY && partial;
        return `<div class="hx-y">${y}${y === cY ? "<small>YTD</small>" : ""}</div>${cells}<div class="hx-tt" data-t="Total ${y}|${n0(yt[yi])}"><div><b>${fu(yt[yi])}</b><span>${(yt[yi] / T * 100).toFixed(1)}%</span></div><u><i class="${isRun ? "r" : ""}" style="width:${(yt[yi] / mxY * 100).toFixed(1)}%"></i></u></div>`
      }).join("");
      const avRow = av ? `<div class="hx-av" style="text-align:left;font-size:14px;padding-top:12px">Avg<small style="text-align:left;font-weight:600;letter-spacing:0">${fy[0]}–${String(fy[fy.length - 1]).slice(2)}</small></div>`
        + av.map((v, i) => `<div class="hx-av"><span class="${i === hi ? "hi" : i === lo ? "lo" : ""}">${f1(v)}</span>${i === hi ? "<small>▲ HIGH</small>" : i === lo ? "<small>▼ LOW</small>" : ""}</div>`).join("") : `<div></div>${"<div></div>".repeat(12)}`;
      const rngTxt = `${MN[firstM - 1]} ${first} – ${MN[lastM - 1]} ${lastY}${partial ? " (month to date)" : ""}`;
      box.innerHTML = `<div class="hx-h"><div><div class="hx-t">Year &amp; Month wise Heatmap</div><div class="hx-s">Monthly volume in ${unL} · the darker the cell, the higher the month</div></div>
<div class="hx-lg">${lg.map((t, i) => `<span><i style="background:${HX_BIN[i]}"></i>${t}</span>`).join("")}</div></div>
<div class="hx-k"><div><small>Grand total</small><b>${n0(T)}</b><span>${rngTxt}</span></div>
<div><small>Best single month</small><b>${pk ? fu(pk.v) : "—"}</b><span>${pk ? MN[pk.m - 1] + " " + pk.y + " · tagged PEAK in the grid" : "—"}</span></div>
<div><small>Strongest · softest month</small><b>${av ? MN[hi] + " " + fu(av[hi]) + " · " + MN[lo] + " " + fu(av[lo]) : "—"}</b><span>${av ? "average of the full years " + fy[0] + (fy.length > 1 ? "–" + String(fy[fy.length - 1]).slice(2) : "") : "—"}</span></div></div>
<div class="hx-w"><div class="hx-g"><div class="hx-hd" style="text-align:left">Year</div>${MN.map(x => `<div class="hx-hd">${x}</div>`).join("")}<div class="hx-hd">Total · share</div>${rows}
${avRow}<div class="hx-gt"><b>${fu(T)}</b><small>GRAND TOTAL · 100%</small></div></div></div>
<div class="hx-ft">${partial ? `<span><i style="background:repeating-linear-gradient(135deg,#dfe5f1 0 3px,#f6f8fc 3px 6px);border:1.5px dashed #8d9ab5"></i>Month still running (${MN[lastM - 1]} ${lastY}, ${cD} days in)</span>` : ""}${pk ? `<span><i style="background:${HX_BIN[5]};box-shadow:0 0 0 2px #fff,0 0 0 3.5px var(--navy)"></i>Peak month</span><span><i style="background:${HX_BIN[0]};box-shadow:0 0 0 2px #fff,0 0 0 3.5px var(--navy)"></i>Lowest full month</span>` : ""}<span><i style="background:#fafbfd;border:1.5px dashed #d5dbe8"></i>No data yet</span></div>`;
      const tip = document.getElementById("hx-tip");
      box.onmousemove = e => {
        const c = e.target.closest("[data-t]");
        if (!c) { hidePanels(); return }
        if (c.dataset.k) { tip.style.display = "none"; hxPanel(+c.dataset.k, e); return }
        document.getElementById("hx-pan").style.display = "none";
        const [l, v] = c.dataset.t.split("|"); tip.innerHTML = `${l}<b>${v}</b>`; tip.style.display = "block";
        tip.style.left = Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8) + "px"; tip.style.top = e.clientY + 16 + "px";
      };
      box.onmouseleave = () => hidePanels();
    }

    /* ---------- FG Production Performance Trend · unit-wise stacked bars, own Year / Month drill-down ---------- */
    let FT = { y: null, m: null }, FA = [];
    const ftV = v => { const x = Math.abs(v); return x >= 1e9 ? (v / 1e9).toFixed(1) + "B" : x >= 1e6 ? (v / 1e6).toFixed(1) + "M" : x >= 1e3 ? Math.round(v / 1e3) + "K" : n0(v) };
    const ftCol = u => UN.indexOf(u) >= 0 ? PAL[UN.indexOf(u) % 8] : "#51607a";
    const ftCSS = `
.ftc .ftc-h{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin:-16px -16px 16px;padding:14px 18px;border-radius:14px 14px 0 0;background:linear-gradient(100deg,#0b3c8f 0%,#1553b8 55%,#1d7ae0 100%);color:#fff}
.ftc .ftc-ic{display:inline-flex;vertical-align:middle;margin-right:10px}
.ftc .ftc-ic svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round}
.ftc .ftc-t{font-size:16px;font-weight:800;color:#fff;letter-spacing:-.01em;line-height:1.2}
.ftc .ftc-s{font-size:12px;color:rgba(255,255,255,.82);margin-top:4px}
.ftc .ftc-ctl{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.ftc .ftc-cal{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-radius:10px;background:rgba(255,255,255,.16);color:#fff;font-size:12.5px;font-weight:700;white-space:nowrap}
.ftc .ftc-cal svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ftc select{height:34px;padding:0 12px;border:1px solid rgba(255,255,255,.35);border-radius:10px;background:#0b2a63;color:#fff;font:600 12.5px Inter,sans-serif;cursor:pointer}
.ftc select:disabled{opacity:.45;cursor:not-allowed}
.ftc .ftc-rs{height:34px;padding:0 14px;border-radius:10px;background:#fff;color:#0f2a5a;border:1.5px solid #fff;font:700 12.5px Inter,sans-serif;cursor:pointer}
.ftc .ftc-rs:hover{background:#e8f0ff}
.ftc .ftc-cv{position:relative;height:380px;margin-top:10px}`;

    function ftRender(a) {
      FA = a;
      if (!document.getElementById("ftc-css")) { const s = document.createElement("style"); s.id = "ftc-css"; s.textContent = ftCSS; document.head.appendChild(s) }
      const host = document.getElementById("ftc"); if (!host) return;

      /* keep the local selection valid against the current global filters */
      const yrs = [...new Set(a.map(r => r.y))].sort((x, y) => x - y);
      if (FT.y != null && !yrs.includes(FT.y)) FT.y = null;
      const mos = FT.y != null ? [...new Set(a.filter(r => r.y === FT.y).map(r => r.m))].sort((x, y) => x - y) : [];
      if (FT.m != null && !mos.includes(FT.m)) FT.m = null;

      /* year → 12 months · year + month → dates of that month · nothing → years */
      const mode = FT.y == null ? "year" : FT.m == null ? "month" : "day";
      const rows = mode === "year" ? a : mode === "month" ? a.filter(r => r.y === FT.y) : a.filter(r => r.y === FT.y && r.m === FT.m);
      const keyOf = mode === "year" ? r => r.y : mode === "month" ? r => r.m : r => r.d;
      const keys = mode === "year" ? yrs
        : mode === "month" ? Array.from({ length: 12 }, (_, i) => i + 1)
          : Array.from({ length: new Date(FT.y, FT.m, 0).getDate() }, (_, i) => i + 1);
      const labelOf = k => mode === "year" ? String(k) : mode === "month" ? MN[k - 1] : String(k);
      const titleOf = k => mode === "year" ? String(k) : mode === "month" ? MN[k - 1] + " " + FT.y : String(k).padStart(2, "0") + " " + MN[FT.m - 1] + " " + FT.y;

      const agg = new Map(keys.map(k => [k, new Map()]));
      rows.forEach(r => { const m = agg.get(keyOf(r)); if (m) m.set(r.unit, (m.get(r.unit) || 0) + r.q) });
      const units = [...new Set(a.map(r => r.unit))].sort();
      const totals = keys.map(k => [...agg.get(k).values()].reduce((s, v) => s + v, 0));
      const grand = totals.reduce((s, v) => s + v, 0), mx = Math.max(...totals, 1);

      const subs = { year: "Year-wise · all years", month: FT.y + " · month-wise (12 months)", day: MN[FT.m - 1] + " " + FT.y + " · date-wise" };
      const period = mode === "year" ? "All years" : mode === "month" ? String(FT.y) : MN[FT.m - 1] + " " + FT.y;
      const yOpts = '<option value="">All years</option>' + yrs.map(y => `<option value="${y}"${FT.y === y ? " selected" : ""}>${y}</option>`).join("");
      const mOpts = '<option value="">All months</option>' + mos.map(m => `<option value="${m}"${FT.m === m ? " selected" : ""}>${MN[m - 1]}</option>`).join("");

      host.innerHTML = `<div class="ftc-h"><div><div class="ftc-t"><span class="ftc-ic"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg></span>FG Production Performance Trend</div><div class="ftc-s">${subs[mode]} · Total ${n0(grand)} · unit wise</div></div>` +
        `<div class="ftc-ctl"><span class="ftc-cal"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>${period}</span>` +
        `<select id="ftY" title="Year">${yOpts}</select><select id="ftM" title="Month"${FT.y == null ? " disabled" : ""}>${mOpts}</select>` +
        `<button class="ftc-rs" id="ftR">Reset</button></div></div>` +
        `<div class="ftc-cv"><canvas id="c3"></canvas></div>`;

      const dsets = units.map(u => ({
        label: u, data: keys.map(k => agg.get(k).get(u) || 0), backgroundColor: ftCol(u), borderColor: "#fff", borderWidth: 1,
        barPercentage: mode === "day" ? .8 : .66, categoryPercentage: .9
      }));
      const totPlugin = {
        id: "ftTot",
        afterDatasetsDraw(ch) {
          const { ctx } = ch;
          /* % share of each unit inside its bar (shown when the segment is tall enough to read) */
          ch.data.datasets.forEach((ds, di) => ch.getDatasetMeta(di).data.forEach((b, i) => {
            const v = ds.data[i], h = Math.abs(b.base - b.y);
            if (!v || !totals[i] || h < 16) return;
            ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
            ctx.font = "700 " + (mode === "day" ? "9.5px" : "11.5px") + " Inter,sans-serif";
            ctx.fillText((v / totals[i] * 100).toFixed(1) + "%", b.x, (b.y + b.base) / 2);
            ctx.restore();
          }));
          /* grand value of each bar on top */
          const bars = ch.getDatasetMeta(ch.data.datasets.length - 1).data;
          ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "bottom"; ctx.fillStyle = "#0f2a5a";
          ctx.font = (mode === "day" ? "700 10px" : "800 12.5px") + " Inter,sans-serif";
          bars.forEach((b, i) => { if (totals[i] > 0) ctx.fillText(ftV(totals[i]), b.x, b.y - 4) });
          ctx.restore()
        }
      };
      mk("c3", {
        type: "bar",
        data: { labels: keys.map(labelOf), datasets: dsets },
        options: {
          responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { top: 24 } },
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: true, position: "bottom", labels: { boxWidth: 16, boxHeight: 10, padding: 16, font: { size: 12 }, color: "#0f2a5a" } },
            tooltip: { callbacks: { title: it => titleOf(keys[it[0].dataIndex]), label: c => ` ${c.dataset.label}: ${n0(c.parsed.y)} (${totals[c.dataIndex] ? (c.parsed.y / totals[c.dataIndex] * 100).toFixed(1) : "0.0"}%)`, footer: it => "Total: " + n0(totals[it[0].dataIndex]) } }
          },
          scales: {
            x: { stacked: true, grid: { display: false }, border: { color: "#9aa3b8" }, ticks: { color: "#0f2a5a", font: { size: mode === "day" ? 10.5 : 12.5 }, autoSkip: false, maxRotation: 0 } },
            y: { stacked: true, beginAtZero: true, suggestedMax: mx * 1.15, border: { display: false }, grid: { color: "#e9ebf0" }, ticks: { callback: v => ftV(v), color: "#6d7c99", font: { size: 12 }, maxTicksLimit: 6 } }
          }
        },
        plugins: [totPlugin]
      });

      document.getElementById("ftY").onchange = e => { FT.y = e.target.value ? +e.target.value : null; FT.m = null; ftRender(FA) };
      document.getElementById("ftM").onchange = e => { FT.m = e.target.value ? +e.target.value : null; ftRender(FA) };
      document.getElementById("ftR").onclick = () => { FT = { y: null, m: null }; ftRender(FA) };
    }

    /* ---------- Shift wise · doughnut + Unit × Shift table (Times-of-Process style) ---------- */
    const shfCSS = `
.shf .shf-w{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.shf .shf-hd{margin:-16px -16px 14px;padding:14px 18px;border-radius:14px 14px 0 0;background:linear-gradient(100deg,#0b3c8f 0%,#1553b8 55%,#1d7ae0 100%);color:#fff}
.shf .shf-ht{font-size:16px;font-weight:800;display:flex;align-items:center}
.shf .shf-ht svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;margin-right:10px}
.shf .shf-hs{font-size:12px;color:rgba(255,255,255,.82);margin-top:4px}
.shf .shf-lg{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;font-size:11.5px;color:#6d7c99;margin-top:6px;width:100%}
.shf .shf-lg span{display:inline-flex;align-items:center;gap:6px;font-weight:600}
.shf .shf-lg i{display:inline-block;width:10px;height:10px;border-radius:2px}
.shf .shf-d{position:relative;width:190px;height:190px;flex:0 0 190px}
.shf .shf-t{flex:1 1 260px;min-width:0;border-radius:12px;overflow:hidden;border:1px solid #e3e8f2}
.shf table{width:100%;border-collapse:collapse;font-size:13px}
.shf thead th{background:#12306b;color:#fff;font-weight:700;font-size:11.5px;padding:9px 8px;text-align:right;white-space:nowrap}
.shf thead th:first-child{text-align:left}
.shf tbody td{padding:8px 8px;font-size:12.5px;border-top:1px solid #eef1f7;text-align:right;color:#0f2a5a;font-weight:700;white-space:nowrap}
.shf tbody td:first-child{text-align:left}
.shf tfoot td{padding:9px 8px;background:#f5f7fb;border-top:2px solid #dbe4f2;text-align:right;font-weight:800;color:#0f2a5a;white-space:nowrap}
.shf tfoot td:first-child{text-align:left}
.shf thead th:not(:first-child):not(:last-child),.shf tbody td:not(:first-child):not(:last-child),.shf tfoot td:not(:first-child):not(:last-child){text-align:center}
.shf .pl{display:inline-block;margin-left:8px;padding:2px 8px;border-radius:999px;font-style:normal;font-size:11.5px;font-weight:700}
.shf .sd{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:middle}
@media (max-width:760px){.shf .shf-d{width:170px;height:170px;flex-basis:170px}}`;

    function shiftCard(a) {
      const host = document.getElementById("shf"); if (!host) return;
      if (!document.getElementById("shf-css")) { const st = document.createElement("style"); st.id = "shf-css"; st.textContent = shfCSS; document.head.appendChild(st) }
      const shifts = [...new Set(a.map(r => r.shift || "N/A"))].sort((x, y) => String(x).localeCompare(String(y)));
      const units = [...new Set(a.map(r => r.unit || "N/A"))].sort();
      /* fixed colours: MORNING = blue, NIGHT = red, any other shift gets the next palette colour */
      const SC = ["#2b5bb8", "#a61935", "#e08a00", "#1f9d55", "#7c4dff"], SL = ["#e3ecfb", "#fde8ea", "#fdf0d5", "#dff5e8", "#ece6ff"], ST_ = ["#1d4fa6", "#b3261e", "#9a6200", "#14703e", "#5b34d9"];
      const shI = s => { const k = ["MORNING", "NIGHT"].indexOf(String(s).toUpperCase()); return k >= 0 ? k : (2 + shifts.indexOf(s)) % 5 };
      const shfF = v => { const x = Math.abs(v); return x >= 1e9 ? (v / 1e9).toFixed(1) + "B" : x >= 1e6 ? (v / 1e6).toFixed(1) + "M" : x >= 1e3 ? (v / 1e3).toFixed(1) + "K" : n0(v) };
      const shPct = (v, t) => t ? (v / t * 100).toFixed(1) + "%" : "0.0%";
      const shPill = (s, t, v) => `<em class="pl" style="background:${SL[shI(s)]};color:${ST_[shI(s)]}">${shPct(v, t)}</em>`;

      const g = new Map(units.map(u => [u, new Map(shifts.map(s => [s, 0]))]));
      a.forEach(r => { const m = g.get(r.unit || "N/A"); const s = r.shift || "N/A"; m.set(s, m.get(s) + r.q) });
      const SH = shifts.map(s => units.reduce((t, u) => t + g.get(u).get(s), 0));
      const GT = SH.reduce((x, y) => x + y, 0);

      const head = `<tr><th>Unit</th>${shifts.map(s => `<th><span class="sd" style="background:${SC[shI(s)]}"></span>${esc(s)}</th>`).join("")}<th>Total</th></tr>`;
      const body = units.map(u => {
        const t = shifts.reduce((x, s) => x + g.get(u).get(s), 0);
        return `<tr><td>${esc(u)}</td>${shifts.map(s => { const v = g.get(u).get(s); return `<td>${v ? shfF(v) + shPill(s, t, v) : '<span style="color:#9aa3b8">–</span>'}</td>` }).join("")}<td>${shfF(t)}</td></tr>`;
      }).join("");
      const foot = `<tr><td>Total</td>${shifts.map((s, i) => `<td>${shfF(SH[i])}${shPill(s, GT, SH[i])}</td>`).join("")}<td>${shfF(GT)}</td></tr>`;

      host.innerHTML = `<div class="shf-hd"><div class="shf-ht"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>Shift wise Performance</div><div class="shf-hs">Unit-wise qty by shift · Total ${shfF(GT)}</div></div><div class="shf-w"><div class="shf-d"><canvas id="p1"></canvas></div><div class="shf-t"><table><thead>${head}</thead><tbody>${body}</tbody><tfoot>${foot}</tfoot></table></div>` +
        `<div class="shf-lg">${[...shifts].sort((x, y) => GT ? SH[shifts.indexOf(y)] - SH[shifts.indexOf(x)] : 0).map(s => `<span><i style="background:${SC[shI(s)]}"></i>${esc(s)} · ${shPct(SH[shifts.indexOf(s)], GT)}</span>`).join("")}</div></div>`;

      mk("p1", {
        type: "doughnut",
        data: { labels: shifts, datasets: [{ data: SH, backgroundColor: shifts.map(s => SC[shI(s)]), borderColor: "#fff", borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: "48%", layout: { padding: 4 }, animation: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.label}: ${n0(c.parsed)} (${shPct(c.parsed, GT)})` } } } },
        plugins: [{
          id: "shc", afterDraw(ch) {
            const { ctx, chartArea: A } = ch, x = (A.left + A.right) / 2, y = (A.top + A.bottom) / 2;
            ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillStyle = "#6d7c99"; ctx.font = "600 12px Inter,sans-serif"; ctx.fillText("Total", x, y - 16);
            ctx.fillStyle = "#0f2a5a"; ctx.font = "800 22px Inter,sans-serif"; ctx.fillText(shfF(GT), x, y + 4);
            ctx.fillStyle = "#6d7c99"; ctx.font = "600 11px Inter,sans-serif"; ctx.fillText("Qty", x, y + 22);
            ch.getDatasetMeta(0).data.forEach((arc, i) => {
              if (!GT || SH[i] / GT < .08) return;
              const m = (arc.startAngle + arc.endAngle) / 2, r = (arc.innerRadius + arc.outerRadius) / 2;
              ctx.fillStyle = "#fff"; ctx.font = "800 11px Inter,sans-serif";
              ctx.fillText(shPct(SH[i], GT), arc.x + Math.cos(m) * r, arc.y + Math.sin(m) * r);
            });
            ctx.restore()
          }
        }]
      });
    }
    function ov(a) {
      $("#pgc").innerHTML = cards(a) + `<div class="cg">${mtHTML(a)}${ytHTML(a)}
 <div class="c w hxc cmp" id="hmc"></div>
 <div class="c w ftc" id="ftc"></div>
 <div class="c shf" id="shf"></div><div class="c"><h4>MC Type wise</h4><div class="cv"><canvas id="p2"></canvas></div></div><div class="c"><div class="bd-hd"><div class="bd-ht"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>Process wise<span class="bd-sub"> – FG Stock</span></div></div><div class="cv" style="height:360px"><canvas id="p3"></canvas></div></div><div class="c"><div class="bd-hd"><div class="bd-ht"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>Types of Process<span class="bd-sub"> – FG Stock</span></div></div><div class="cv" style="height:360px"><canvas id="p4"></canvas></div></div>
 <div class="c w"><div style="font-size:19px;font-weight:800;color:var(--navy);letter-spacing:.01em;line-height:1.2">TOP BUYER CONTRIBUTION ANALYSIS</div><div id="c4s" style="font-size:12px;font-weight:600;letter-spacing:.06em;color:var(--mute);margin:6px 0 10px"></div><div class="cv" style="height:400px"><canvas id="c4"></canvas></div><div style="text-align:right;font-size:12px;color:var(--mute);margin-top:6px">Share of total volume &nbsp;·&nbsp; Darker green = higher share</div></div></div>`;
      const mm = grp(a, r => r.y * 100 + r.m).sort((x, y) => x.k - y.k);
      mtChart();
      const yy = grp(a, r => r.y).sort((x, y) => x.k - y.k);
      YTA = a;
      ytChart();
      ftRender(a);
      const pie = (id, key) => {
        let g = grp(a, r => r[key] || "N/A").sort((x, y) => y.q - x.q);
        if (g.length > 8) g = g.slice(0, 7).concat({ k: "Others", q: g.slice(7).reduce((s, x) => s + x.q, 0) });
        const v = g.map(x => x.q), T = v.reduce((x, y) => x + y, 0), P = x => T ? (x / T * 100).toFixed(1) + "%" : "0%";
        mk(id, {
          type: "doughnut", data: { labels: g.map((x, i) => x.k + " · " + P(v[i])), datasets: [{ data: v, backgroundColor: g.map((x, i) => PAL[i % 8]), borderColor: "#fff", borderWidth: 2 }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: "60%", plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } }, tooltip: { callbacks: { label: c => ` ${g[c.dataIndex].k}: ${n0(c.parsed)} (${P(c.parsed)})` } } } },
          plugins: [{
            id: "ctr", afterDraw(ch) {
              const { ctx, chartArea: A } = ch, x = (A.left + A.right) / 2, y = (A.top + A.bottom) / 2; ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#0f2a5a"; ctx.font = "800 22px Inter,sans-serif"; ctx.fillText(ab(T), x, y - 8); ctx.fillStyle = "#6d7c99"; ctx.font = "600 11px Inter,sans-serif"; ctx.fillText("TOTAL", x, y + 13);
              ch.getDatasetMeta(0).data.forEach((arc, i) => { if (!T || v[i] / T < .03) return; const m = (arc.startAngle + arc.endAngle) / 2, r = (arc.innerRadius + arc.outerRadius) / 2; ctx.fillStyle = "#fff"; ctx.font = "700 12px Inter,sans-serif"; ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 3; ctx.fillText(P(v[i]), arc.x + Math.cos(m) * r, arc.y + Math.sin(m) * r) }); ctx.restore()
            }
          }]
        })
      };
      shiftCard(a); pie("p2", "mc");
      const pie2 = (id, key) => {
        const g = grp(a, r => r[key] || "N/A").sort((x, y) => y.q - x.q), v = g.map(x => x.q), T = v.reduce((x, y) => x + y, 0), P = x => T ? (x / T * 100).toFixed(1) + "%" : "0%",
          TC = ["#3d7a87", "#74cde4", "#4a9db5", "#6fcbe3", "#4e9fb7", "#b9e3ef", "#5aa7bd", "#86d3e8", "#a6dcec", "#2f6f7e", "#9fd9ea", "#c8eaf3"], cut = s => s.length > 26 ? s.slice(0, 24) + "…" : s;
        mk(id, {
          type: "pie", data: { labels: g.map(x => x.k), datasets: [{ data: v, backgroundColor: g.map((x, i) => TC[i % 12]), borderColor: "#fff", borderWidth: 2 }] },
          options: { responsive: true, maintainAspectRatio: false, layout: { padding: { left: 170, right: 170, top: 28, bottom: 28 } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${g[c.dataIndex].k}: ${n0(c.parsed)} (${P(c.parsed)})` } } } },
          plugins: [{
            id: "lbl", afterDatasetsDraw(ch) {
              const { ctx } = ch; ctx.save(); ctx.font = "500 11px Inter,sans-serif"; ctx.fillStyle = "#3a4d73"; ctx.strokeStyle = "#9aa8c2"; ctx.lineWidth = 1;
              ch.getDatasetMeta(0).data.forEach((arc, i) => {
                if (!T || v[i] / T < .03) return; const m = (arc.startAngle + arc.endAngle) / 2, c = Math.cos(m), s = Math.sin(m), R = arc.outerRadius, x1 = arc.x + c * R, y1 = arc.y + s * R, x2 = arc.x + c * (R + 16), y2 = arc.y + s * (R + 16), rt = c >= 0, x3 = x2 + (rt ? 18 : -18);
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y2); ctx.stroke(); ctx.textAlign = rt ? "left" : "right"; ctx.textBaseline = "bottom"; ctx.fillText(cut(g[i].k), x3 + (rt ? 4 : -4), y2 + 1); ctx.textBaseline = "top"; ctx.fillText(P(v[i]), x3 + (rt ? 4 : -4), y2 + 2)
              }); ctx.restore()
            }
          }]
        })
      };
      let fm, mkExt;
      {
        const fq = v => Math.abs(v) >= 1e6 ? (v / 1e6).toFixed(2) + "M" : Math.abs(v) >= 1e3 ? (v / 1e3).toFixed(1) + "K" : n0(v);
        let g = grp(a, r => r.proc || "N/A").sort((x, y) => y.q - x.q); if (g.length > 11) g = g.slice(0, 11);
        const v = g.map(x => x.q), T = v.reduce((x, y) => x + y, 0), P = x => T ? (x / T * 100).toFixed(1) + "%" : "0%", cut = t => t.length > 28 ? t.slice(0, 26) + "…" : t;
        const isO = (x, i) => x.k === "Others" && g.length > 1 && i === g.length - 1 && g.length === 7;
        const bc = g.map((x, i) => isO(x, i) ? "#d9d9d9" : i === 0 ? "#2f6f7e" : "#a8d8e6");
        /* hover tooltip: Top 10 models of the hovered process (value like 6.49M / 735K / 12.0K) */
        fm = x => x >= 1e6 ? (x / 1e6).toFixed(2) + "M" : x >= 1e5 ? Math.round(x / 1e3) + "K" : x >= 1e3 ? (x / 1e3).toFixed(1) + "K" : n0(x);
        const pm = new Map(); a.forEach(r => { const pr = r.proc || "N/A"; let m = pm.get(pr); if (!m) pm.set(pr, m = new Map()); m.set(r.model, (m.get(r.model) || 0) + r.q) });
        const topM = i => {
          let m; if (isO(g[i], i)) { m = new Map(); const keep = new Set(g.slice(0, -1).map(x => x.k)); pm.forEach((mm, pr) => { if (!keep.has(pr)) mm.forEach((q, k) => m.set(k, (m.get(k) || 0) + q)) }) } else m = pm.get(g[i].k) || new Map();
          return [...m].map(([k, q]) => ({ k: k || "N/A", q })).sort((x, y) => y.q - x.q).slice(0, 10)
        };
        if (!document.getElementById("pt-css")) {
          const st = document.createElement("style"); st.id = "pt-css";
          st.textContent = `#pt-tip{position:fixed;z-index:9999;pointer-events:none;display:none;width:300px;background:#fff;border-radius:12px;padding:12px 14px;box-shadow:0 10px 30px rgba(15,42,90,.22);border:1px solid #e3e8f2;font-family:Inter,sans-serif}
#pt-tip .h{font-size:13px;font-weight:800;color:#0f2a5a;line-height:1.3;word-break:break-word}#pt-tip .h span{display:block;font-size:11.5px;font-weight:600;color:#6d7c99;margin-top:2px}
#pt-tip .by{font-size:10.5px;font-weight:700;letter-spacing:.08em;color:#6d7c99;margin:10px 0 6px;text-transform:uppercase}
#pt-tip .r{display:grid;grid-template-columns:86px 1fr 52px;align-items:center;gap:8px;margin:5px 0;font-size:12.5px}
#pt-tip .r em{font-style:normal;color:#0b5fa5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#pt-tip .r u{display:block;height:8px;border-radius:9px;background:#e8ecf3;text-decoration:none;overflow:hidden}
#pt-tip .r u i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#0a84c6,#00bcd4)}
#pt-tip .r b{text-align:right;color:#0f2a5a;font-weight:800}`;
          document.head.appendChild(st); const d = document.createElement("div"); d.id = "pt-tip"; document.body.appendChild(d)
        }
        mkExt = (names, vals, pf, tm) => c => {
          const tp = document.getElementById("pt-tip"), t = c.tooltip; if (!t || t.opacity === 0 || !t.dataPoints || !t.dataPoints.length) { tp.style.display = "none"; return }
          const i = t.dataPoints[0].dataIndex, L = tm(i), mx = L.length ? L[0].q : 1;
          tp.innerHTML = `<div class="h">${esc(names[i])}<span>${fm(vals[i])} · ${pf(vals[i])}</span></div><div class="by">By model · Top ${L.length}</div>` + L.map(x => `<div class="r"><em title="${esc(x.k)}">${esc(x.k)}</em><u><i style="width:${(x.q / mx * 100).toFixed(1)}%"></i></u><b>${fm(x.q)}</b></div>`).join("");
          tp.style.display = "block"; const R = c.chart.canvas.getBoundingClientRect(); let x = R.left + t.caretX + 16, y = R.top + t.caretY - 20;
          if (x + tp.offsetWidth > innerWidth - 8) x = R.left + t.caretX - tp.offsetWidth - 16; if (y + tp.offsetHeight > innerHeight - 8) y = innerHeight - tp.offsetHeight - 8; tp.style.left = Math.max(8, x) + "px"; tp.style.top = Math.max(8, y) + "px"
        };
        const tt = { enabled: false, external: mkExt(g.map(x => x.k), v, P, topM) };
        const nm3 = g.map(x => String(x.k).toUpperCase()), cut3 = t => t.length > 34 ? t.slice(0, 32) + "…" : t;
        const mc3 = document.createElement("canvas").getContext("2d"); mc3.font = "700 12px Inter,sans-serif";
        const padL3 = Math.ceil(Math.max(...nm3.map(t => mc3.measureText(cut3(t)).width), 80)) + 44;
        const cv3 = document.getElementById("p3"); if (cv3) cv3.parentNode.style.height = (g.length * 38 + 44) + "px";
        const axF = x => x >= 1e6 ? (x / 1e6).toFixed(1) + "M" : x >= 1e3 ? Math.round(x / 1e3) + "K" : String(Math.round(x));
        const vF = x => x >= 1e6 ? (x / 1e6).toFixed(1) + "M" : x >= 1e3 ? Math.round(x / 1e3) + "K" : n0(x);
        const mxV = Math.max(...v, 1), stepsP = [1e5, 2e5, 2.5e5, 5e5, 1e6, 2.5e6, 5e6, 1e7, 2.5e7, 5e7], stpP = stepsP.find(q => mxV / q <= 6) || 1e8;
        mk("p3", {
          type: "bar",
          data: {
            labels: g.map(x => x.k), datasets: [{
              data: v, borderRadius: 6, barPercentage: .66, categoryPercentage: .9,
              backgroundColor: c => { const el = c.element, cx = c.chart.ctx; if (!el || el.x == null || el.base == null) return "#ff9f3c"; const gr = cx.createLinearGradient(el.base, 0, el.x, 0); gr.addColorStop(0, "#ffc56e"); gr.addColorStop(1, "#ff8a00"); return gr }
            }]
          },
          options: {
            indexAxis: "y", responsive: true, maintainAspectRatio: false, animation: false,
            layout: { padding: { left: padL3, right: 36, top: 6, bottom: 4 } },
            plugins: { legend: { display: false }, tooltip: tt },
            scales: {
              x: { display: true, position: "bottom", beginAtZero: true, max: Math.ceil(mxV * 1.18 / stpP) * stpP, grid: { color: "#e9ecf3" }, border: { display: false }, ticks: { stepSize: stpP, color: "#6d7c99", font: { size: 11 }, callback: axF, maxRotation: 0 } },
              y: { display: false, grid: { display: false } }
            }
          },
          plugins: [{
            id: "rk", afterDatasetsDraw(ch) {
              const cx = ch.ctx; cx.save();
              ch.getDatasetMeta(0).data.forEach((b, i) => {
                cx.beginPath(); cx.arc(16, b.y, 9, 0, 7); cx.fillStyle = "#0f2a5a"; cx.fill();
                cx.fillStyle = "#fff"; cx.font = "800 10.5px Inter,sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText(String(i + 1), 16, b.y + .5);
                cx.textAlign = "left"; cx.fillStyle = "#0f2a5a"; cx.font = "700 12px Inter,sans-serif"; cx.fillText(cut3(nm3[i]), 32, b.y);
                const txt = vF(v[i]) + " – " + P(v[i]); cx.font = "700 12px Inter,sans-serif"; const w = cx.measureText(txt).width;
                if (b.x - b.base > w + 18) { cx.textAlign = "right"; cx.fillStyle = "#fff"; cx.fillText(txt, b.x - 9, b.y) }
                else { cx.textAlign = "left"; cx.fillStyle = "#0f2a5a"; cx.fillText(txt, b.x + 8, b.y) }
              });
              cx.restore()
            }
          }]
        });
        /* Types of Process doughnut = "Times of Process" column of the uploaded file (1 TIME / 2 TIME / 3 TIME PROCESS) */
        const g2 = grp(a, r => r.tp || "N/A").sort((x, y) => String(x.k).localeCompare(String(y.k), undefined, { numeric: true })), v2 = g2.map(x => x.q), T2 = v2.reduce((x, y) => x + y, 0), P2 = x => T2 ? (x / T2 * 100).toFixed(1) + "%" : "0%";
        const hasTP = a.some(r => r.tp), cv = document.getElementById("p4");
        let nt = document.getElementById("p4n"); if (!nt) { nt = document.createElement("div"); nt.id = "p4n"; nt.style.cssText = "font-size:12.5px;color:var(--mute);padding:8px 2px" }
        nt.textContent = hasTP || !a.length ? "" : "Times of Process data not found. Re-upload the FG file with fg-pack.html (column: Times of Process).";
        const PC = ["#2f6f7e", "#74cde4", "#e08a00", "#a61935", "#7c4dff", "#1f9d55"], PT = ["#fff", "#0f2a5a", "#fff", "#fff", "#fff", "#fff"];
        const dc = g2.map((x, i) => x.k === "N/A" ? "#d9d9d9" : PC[i % 6]), dtx = g2.map((x, i) => x.k === "N/A" ? "#0f2a5a" : PT[i % 6]);
        const pm2 = new Map(); a.forEach(r => { const tk = r.tp || "N/A"; let m = pm2.get(tk); if (!m) pm2.set(tk, m = new Map()); m.set(r.model, (m.get(r.model) || 0) + r.q) });
        const topM2 = i => [...(pm2.get(g2[i].k) || new Map())].map(([k, q]) => ({ k: k || "N/A", q })).sort((x, y) => y.q - x.q).slice(0, 10);
        const tpF = x => x >= 1e6 ? (x / 1e6).toFixed(1) + "M" : x >= 1e3 ? Math.round(x / 1e3) + "K" : n0(x);
        const box4 = cv.parentNode;
        box4.style.cssText = "display:flex;gap:24px;align-items:center;justify-content:center;flex-wrap:wrap;height:auto;flex:1 1 auto;padding:6px 0"; const card4 = box4.parentNode; card4.style.display = "flex"; card4.style.flexDirection = "column";
        const rows4 = g2.map((x, i) => `<tr><td><span class="tpd" style="background:${dc[i]}"></span>${esc(String(x.k).toUpperCase())}</td><td><em style="background:${dc[i]}26;color:#0f2a5a">${T2 ? (x.q / T2 * 100).toFixed(1) : "0.0"}%</em></td><td>${tpF(x.q)}</td></tr>`).join("");
        box4.innerHTML = `<div style="position:relative;width:250px;height:250px;flex:0 0 250px"><canvas id="p4"></canvas></div><div style="flex:1 1 300px;min-width:0;border-radius:12px;overflow:hidden;border:1px solid #e3e8f2"><table class="tpT"><thead><tr><th>Times of Process</th><th>Percentage (%)</th><th>Qty</th></tr></thead><tbody>${rows4}</tbody></table></div>`;
        nt.style.flex = "0 0 100%"; box4.appendChild(nt);
        mk("p4", {
          type: "doughnut", data: { labels: g2.map(x => x.k), datasets: [{ data: v2, backgroundColor: dc, borderColor: "#fff", borderWidth: 2 }] },
          options: { responsive: true, maintainAspectRatio: false, cutout: "58%", animation: false, plugins: { legend: { display: false }, tooltip: { enabled: false, external: mkExt(g2.map(x => x.k), v2, P2, topM2) } } },
          plugins: [{
            id: "ctr", afterDraw(ch) {
              const { ctx, chartArea: A } = ch, x = (A.left + A.right) / 2, y = (A.top + A.bottom) / 2; ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#0f2a5a"; ctx.font = "800 22px Inter,sans-serif"; ctx.fillText(ab(T2), x, y - 8); ctx.fillStyle = "#6d7c99"; ctx.font = "600 11px Inter,sans-serif"; ctx.fillText("TOTAL", x, y + 13);
              ch.getDatasetMeta(0).data.forEach((arc, i) => { if (!T2 || v2[i] / T2 < .03) return; const m = (arc.startAngle + arc.endAngle) / 2, r = (arc.innerRadius + arc.outerRadius) / 2; ctx.fillStyle = dtx[i]; ctx.font = "700 13px Inter,sans-serif"; ctx.fillText(P2(v2[i]), arc.x + Math.cos(m) * r, arc.y + Math.sin(m) * r) }); ctx.restore()
            }
          }]
        })
      }
      {
        const T = sumq(a), tb = grp(a, r => r.buyer || "N/A").sort((x, y) => y.q - x.q).slice(0, 15), P = x => T ? (x / T * 100).toFixed(1) + "%" : "0%";
        const sb = document.getElementById("c4s"); if (sb) sb.textContent = "TOP " + tb.length + " BUYERS  |  SHARE OF TOTAL VOLUME";
        const mxq = tb.length ? tb[0].q : 1, mix = (x, t) => { const L = [191, 230, 205], D = [18, 77, 47]; return "rgb(" + L.map((l, k) => Math.round(l + (D[k] - l) * t)).join(",") + ")" };
        const bc = tb.map(x => mix(x, mxq ? Math.pow(x.q / mxq, .55) : 0));
        const bm = new Map(); a.forEach(r => { const b = r.buyer || "N/A"; let m = bm.get(b); if (!m) bm.set(b, m = new Map()); m.set(r.model, (m.get(r.model) || 0) + r.q) });
        const tmB = i => [...(bm.get(tb[i].k) || new Map())].map(([k, q]) => ({ k: k || "N/A", q })).sort((x, y) => y.q - x.q).slice(0, 10);
        mk("c4", {
          type: "bar", data: { labels: tb.map(x => x.k), datasets: [{ label: "Share", data: tb.map(x => T ? x.q / T * 100 : 0), backgroundColor: bc, borderRadius: 0, barPercentage: .66, categoryPercentage: 1 }] },
          options: {
            responsive: true, maintainAspectRatio: false, animation: false, layout: { padding: { top: 28, right: 8 } },
            plugins: { legend: { display: false }, tooltip: { enabled: false, external: mkExt(tb.map(x => x.k), tb.map(x => x.q), P, tmB) } },
            scales: { x: { grid: { display: false }, border: { color: "#c9d2e3" }, ticks: { autoSkip: false, minRotation: 30, maxRotation: 30, color: "#0f2a5a", font: { size: 12 } } }, y: { beginAtZero: true, border: { display: false }, grid: { color: "#eceff5" }, ticks: { callback: v => v + "%", color: "#6d7c99", font: { size: 11.5 }, maxTicksLimit: 6 } } }
          },
          plugins: [{
            id: "pc", afterDatasetsDraw(ch) {
              const { ctx } = ch; ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#0f2a5a"; ctx.font = "800 13.5px Inter,sans-serif";
              ch.getDatasetMeta(0).data.forEach((b, i) => ctx.fillText(P(tb[i].q), b.x, b.y - 10)); ctx.restore()
            }
          }]
        })
      }
      hmRender(a)
    }
    /* ---------- raw data cards (icon · qty · vs LY · yearly mini bars) ---------- */
    const IC_F = '<svg viewBox="0 0 24 24"><path fill="#fff" stroke="none" d="M2 21V10l6 3.6V10l6 3.6V3h3.4v10.6H22V21z"/><path fill="rgba(0,40,120,.35)" stroke="none" d="M5 17h2.2v2.2H5zM10 17h2.2v2.2H10zM15 17h2.2v2.2H15zM18.6 17H20v2.2h-1.4z"/></svg>';
    const IC_C = '<svg viewBox="0 0 24 24"><path fill="#fff" stroke="none" d="M12 2l9 5-9 5-9-5z"/><path fill="#fff" fill-opacity=".85" stroke="none" d="M3 8.9l8.4 4.7V22L3 17.2z"/><path fill="#fff" fill-opacity=".62" stroke="none" d="M21 8.9l-8.4 4.7V22l8.4-4.8z"/></svg>';
    /* vs LY = latest year (up to its last data day) ÷ same period of the previous year − 1 */
    function lyInfo(a) {
      let Y = 0, last = ""; a.forEach(r => { if (r.y > Y) { Y = r.y; last = r.ds } else if (r.y === Y && r.ds > last) last = r.ds });
      const lm = +last.slice(5, 7), ld = +last.slice(8, 10);
      return pred => { let c = 0, l = 0; a.forEach(r => { if (!pred(r)) return; if (r.y === Y) c += r.q; else if (r.y === Y - 1 && (r.m < lm || (r.m === lm && r.d <= ld))) l += r.q }); return l > 0 ? (c / l - 1) * 100 : null }
    }
    function rawCards(a) {
      const u = {}, yu = {}, ys = [...new Set(a.map(r => r.y))].sort((x, y) => x - y).slice(-7);
      a.forEach(r => { u[r.unit] = (u[r.unit] || 0) + r.q; const k = r.unit + "|" + r.y; yu[k] = (yu[k] || 0) + r.q; yu["*|" + r.y] = (yu["*|" + r.y] || 0) + r.q });
      const ly = lyInfo(a), CL = ["rk-1", "rk-2", "rk-3", "rk-5"];
      const card = (cls, ico, title, val, pct, key) => {
        const vs = ys.map(y => yu[key + "|" + y] || 0), mx = Math.max(...vs, 1);
        const H = 40, BW = 6, GP = 3, hs = vs.map(v => Math.max(10, Math.round(v / mx * 100))), bars = hs.map((h, i) => `<i style="height:${h}%"${i === vs.length - 1 ? ' class="l"' : ""}></i>`).join("");
        const W = vs.length * (BW + GP) - GP, pts = hs.map((h, i) => [i * (BW + GP) + BW / 2, H - H * h / 100 - 4]);
        let tr = ""; if (pts.length > 1) { const [lx, ly2] = pts[pts.length - 1], [px, py] = pts[pts.length - 2], an = Math.atan2(ly2 - py, lx - px) * 180 / Math.PI; tr = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><polygon points="0,-3.5 7,0 0,3.5" fill="rgba(255,255,255,.9)" transform="translate(${lx},${ly2}) rotate(${an})"/></svg>` }
        const g = pct == null ? '<span class="rk-g na">– vs LY</span>' : `<span class="rk-g ${pct < 0 ? "dn" : "up"}"><em>${pct < 0 ? "▼" : "▲"}</em>${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% vs LY</span>`;
        return `<div class="rk ${cls}"><div class="rk-ic">${ico}</div><div class="rk-tx"><small>${esc(title)}</small><b>${n0(val)}</b>${g}</div><div class="rk-bars">${bars}${tr}</div></div>`
      };
      return `<div class="rkp">${card("rk-t", IC_F, "Total Qty", sumq(a), ly(() => true), "*")}${UN.map((x, i) => card(CL[i] || "rk-1", IC_C, x + " Qty", u[x] || 0, ly(r => r.unit === x), x)).join("")}</div>`
    }
    /* ---------- raw data : Model · Color × Year(collapsible) · Month ---------- */
    let PV = [], YR = [], OPEN = new Set(), MOPEN = new Set(), CM = {}, CG = 0, GT = 0, MX = 0, DX = 0, pgn = 0; const PS = 100;
    function raw(a) {
      const m = new Map(); a.forEach(r => { const k = r.model + "|" + r.color; let o = m.get(k); if (!o) m.set(k, o = { model: r.model, color: r.color, v: new Map(), dv: new Map(), t: 0 }); const q = r.y * 100 + r.m, dk = q * 100 + r.d; o.v.set(q, (o.v.get(q) || 0) + r.q); o.dv.set(dk, (o.dv.get(dk) || 0) + r.q); o.t += r.q });
      PV = [...m.values()].sort((x, y) => y.t - x.t || x.model.localeCompare(y.model));
      YR = [...new Set(a.map(r => r.y))].sort((x, y) => x - y); PV.forEach(o => { o.yt = {}; YR.forEach(y => { let t = 0; for (let i = 1; i <= 12; i++)t += o.v.get(y * 100 + i) || 0; o.yt[y] = t }) });
      CM = {}; YR.forEach(y => CM[y] = PV.reduce((x, o) => Math.max(x, o.yt[y]), 0)); CG = PV.reduce((x, o) => Math.max(x, o.t), 0); GT = PV.reduce((x, o) => x + o.t, 0); MX = 0; DX = 0; PV.forEach(o => { o.v.forEach(v => { if (v > MX) MX = v }); o.dv.forEach(v => { if (v > DX) DX = v }) });
      pgn = 0; $("#pgc").innerHTML = rawCards(a) + `<div class="pg"><span id="pi"></span><div style="display:flex;gap:8px"><button class="bx" onclick="ya(1)"><i><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></i>Expand All</button><button class="bx" onclick="ya(0)"><i><svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg></i>Collapse All</button><button class="bx" onclick="pp(-1)">‹ Prev</button><button class="bx" onclick="pp(1)">Next ›</button><button class="bx dk" onclick="dx()"><svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>Download Excel</button></div></div><div class="rwt" id="tb"></div>`; rt()
    }
    const ya = f => { OPEN = new Set(f ? YR : []); if (!f) MOPEN = new Set(); rt() }, dim = (y, m) => new Date(y, m, 0).getDate(), dl = (m, d) => String(d).padStart(2, "0") + "-" + MN[m - 1], mtg = k => { MOPEN.has(k) ? MOPEN.delete(k) : MOPEN.add(k); rt() }, tg = y => { OPEN.has(y) ? OPEN.delete(y) : OPEN.add(y); rt() };
    const pc = (v, t) => t ? (v / t * 100).toFixed(1) + "%" : "0%", bar = (txt, v, m) => v ? `<td class="r db"><i style="width:${m ? Math.max(4, Math.round(v / m * 100)) : 0}%"></i><span>${txt}</span></td>` : `<td class="db"></td>`;
    function rt() {
      const s = pgn * PS, p = PV.slice(s, s + PS);
      $("#pi").textContent = PV.length ? `${s + 1}–${Math.min(s + PS, PV.length)} of ${PV.length} models` : "0 rows";
      const YT = {}, MT = new Map(), DT = new Map(); PV.forEach(o => { YR.forEach(y => YT[y] = (YT[y] || 0) + o.yt[y]); o.v.forEach((v, k) => MT.set(k, (MT.get(k) || 0) + v)); o.dv.forEach((v, k) => DT.set(k, (DT.get(k) || 0) + v)) });
      const mo = (y, i) => OPEN.has(y) && MOPEN.has(y * 100 + i + 1), any = YR.some(y => MN.some((_, i) => mo(y, i))), rs = any ? 3 : 2, rsp = any ? ' rowspan="2"' : "";
      const span = y => MN.reduce((n, _, i) => n + (mo(y, i) ? dim(y, i + 1) : 1), 0), days = (y, i) => Array.from({ length: dim(y, i + 1) }, (_, d) => d);
      const yh = YR.map(y => OPEN.has(y) ? `<th colspan="${span(y)}" class="yh" onclick="tg(${y})">${y}<i>▾</i></th>` : `<th class="yh" onclick="tg(${y})">${y}<i>▸</i></th>`).join(""),
        sh = YR.map(y => OPEN.has(y) ? MN.map((x, i) => { const k = y * 100 + i + 1; return mo(y, i) ? `<th colspan="${dim(y, i + 1)}" class="sh mo ys" onclick="mtg(${k})">${x}<i>▾</i></th>` : `<th class="sh mo${i ? "" : " ys"}"${rsp} onclick="mtg(${k})">${x}<i>▸</i></th>` }).join("") : `<th class="sh ys"${rsp}>Qty | % Contribution</th>`).join(""),
        dh = any ? "<tr>" + YR.map(y => OPEN.has(y) ? MN.map((_, i) => mo(y, i) ? days(y, i).map(d => `<th class="sh dh${d ? "" : " ys"}">${dl(i + 1, d + 1)}</th>`).join("") : "").join("") : "").join("") + "</tr>" : "";
      const cell = (txt, v, m, f, x) => v ? `<td class="bc${f ? " ys" : ""}${x ? " " + x : ""}"><i style="width:${m ? Math.max(4, Math.round(v / m * 100)) : 0}%"></i><span>${txt}</span></td>` : `<td class="bc z${f ? " ys" : ""}${x ? " " + x : ""}"><span>-</span></td>`;
      const body = p.map(o => `<tr><td class="c1">${esc(o.model)}</td><td class="c2">${esc(o.color)}</td>${YR.map(y => OPEN.has(y) ? MN.map((_, i) => { const k = y * 100 + i + 1; if (mo(y, i)) return days(y, i).map(d => { const v = o.dv.get(k * 100 + d + 1) || 0; return cell(n0(v), v, DX, d === 0, "dc") }).join(""); const v = o.v.get(k) || 0; return cell(n0(v), v, MX, i === 0) }).join("") : cell(`${n0(o.yt[y])} | ${pc(o.yt[y], o.t)}`, o.yt[y], CM[y], true)).join("")}<td class="bc gc"><i style="width:${CG ? Math.max(4, Math.round(o.t / CG * 100)) : 0}%"></i><span><b>${n0(o.t)}</b><em>${pc(o.t, GT)}</em></span></td></tr>`).join("");
      const ft = YR.map(y => OPEN.has(y) ? MN.map((_, i) => { const k = y * 100 + i + 1; if (mo(y, i)) return days(y, i).map(d => `<td${d ? "" : ' class="ys"'}>${n0(DT.get(k * 100 + d + 1) || 0)}</td>`).join(""); return `<td${i ? "" : ' class="ys"'}>${n0(MT.get(k) || 0)}</td>` }).join("") : `<td>${n0(YT[y] || 0)}</td>`).join("");
      const foot = PV.length ? `<tfoot><tr><td class="f1" colspan="2"><svg viewBox="0 0 24 24"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>Total Production</td>${ft}<td class="gt">${n0(GT)}</td></tr></tfoot>` : "";
      $("#tb").innerHTML = `<table class="pv2"><thead><tr><th class="mh c1" rowspan="${rs}">Model</th><th class="mh c2" rowspan="${rs}">Color</th>${yh}<th class="mh gh" rowspan="${rs}">Grand Total</th></tr><tr>${sh}</tr>${dh}</thead><tbody>${body || `<tr><td colspan="${YR.length + 3}" style="text-align:center;padding:40px;color:#6d7c99">No data for the selected filters</td></tr>`}</tbody>${foot}</table>`
    }
    function pp(d) { const mx = Math.max(0, Math.ceil(PV.length / PS) - 1); pgn = Math.min(mx, Math.max(0, pgn + d)); rt(); $("#tb").scrollTop = 0 }
    function dx() {
      if (!PV.length || !window.XLSX) return alert("Nothing to download.");
      const rows = PV.map(o => { const r = { Model: o.model, Color: o.color }; YR.forEach(y => { r[y + " Total Qty"] = o.yt[y]; r[y + " Contribution %"] = o.t ? +(o.yt[y] / o.t * 100).toFixed(1) : 0; MN.forEach((n, i) => { r[y + "-" + n] = o.v.get(y * 100 + i + 1) || 0 }) }); r["Grand Total"] = o.t; return r });
      const w = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(w, XLSX.utils.json_to_sheet(rows), "Finish Good"); XLSX.writeFile(w, "FG_Raw_Data_" + new Date().toISOString().slice(0, 10) + ".xlsx")
    }
    async function init() {
      $("#pgc").innerHTML = '<div class="empty"><b>Finish Good</b>Loading data…</div>';
      try { if (!(await load())) return } catch (e) { console.error(e); msg = "Could not load data: " + (e.message || e) }
      fbuild(); draw()
    }
    init();
  </script>
  <script id="rsp-v1-js">
    /* ===================== RESPONSIVE v1 · collapsible filter (UI only) ===================== */
    (function () {
      var MQ = matchMedia('(max-width:767px)'), isOpen = false, tmr = 0, obs = null, raf = 0;
      var FUN = '<svg viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>';
      var CHV = '<svg class="fbv" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
      function closePopup() { var p = document.getElementById('pn'); if (p) p.style.display = 'none'; var q = document.getElementById('pop'); if (q) q.classList.remove('on') }
      function setOpen(wrap, on, instant) {
        clearTimeout(tmr);
        if (on) {
          wrap.style.setProperty('--fbh', wrap.scrollHeight + 'px');
          if (instant) { wrap.classList.add('open'); wrap.style.setProperty('--fbh', 'none') }
          else { wrap.classList.add('open'); tmr = setTimeout(function () { wrap.style.setProperty('--fbh', 'none') }, 400) }
        } else {
          closePopup();
          if (instant) { wrap.style.setProperty('--fbh', '0px'); wrap.classList.remove('open') }
          else { wrap.style.setProperty('--fbh', wrap.scrollHeight + 'px'); void wrap.offsetHeight; wrap.style.setProperty('--fbh', '0px'); wrap.classList.remove('open') }
        }
        isOpen = on; sync();
      }
      function count(fb) {
        var n = fb.querySelectorAll('.f button.on,.fp.on').length;
        fb.querySelectorAll('input[type=date]').forEach(function (i) { if (i.value) n++ });
        return n;
      }
      function sync() {
        var fb = document.getElementById('fb'); if (!fb) return;
        var t = document.querySelector('.fbt'); if (!t) return;
        t.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        var n = count(fb), b = t.querySelector('.fbn'); b.textContent = n ? n + ' active' : '';
        t.hidden = !fb.children.length;
      }
      function ensure() {
        var fb = document.getElementById('fb');
        if (!fb) { document.querySelectorAll('.fbt').forEach(function (t) { t.remove() }); return }
        var wrap = fb.parentElement;
        if (!wrap.classList.contains('fbc')) {
          wrap = document.createElement('div'); wrap.className = 'fbc';
          fb.parentNode.insertBefore(wrap, fb); wrap.appendChild(fb);
          var a = document.createElement('div'); a.className = 'fba';
          a.innerHTML = '<button type="button" class="fbr">Reset</button><button type="button" class="fbp">Apply</button>';
          wrap.appendChild(a);
          a.querySelector('.fbr').onclick = function () { var r = fb.querySelector('.rs'); if (r) r.click(); setTimeout(sync, 60) };
          a.querySelector('.fbp').onclick = function () { setOpen(wrap, false) };
          if (isOpen && MQ.matches) setOpen(wrap, true, true);
          if (obs) obs.disconnect();
          obs = new MutationObserver(function () { sync() });
          obs.observe(fb, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }
        var host = fb.closest('.fbw') || wrap;
        var prev = host.previousElementSibling;
        if (!prev || !prev.classList.contains('fbt')) {
          document.querySelectorAll('.fbt').forEach(function (t) { t.remove() });
          var t = document.createElement('button'); t.type = 'button'; t.className = 'fbt'; t.setAttribute('aria-expanded', 'false');
          t.innerHTML = FUN + '<span class="fbl">Filters</span><span class="fbn"></span>' + CHV;
          t.onclick = function () { var w = document.querySelector('.fbc'); if (w) setOpen(w, !isOpen) };
          host.parentNode.insertBefore(t, host);
        }
        sync();
      }
      function sched() { cancelAnimationFrame(raf); raf = requestAnimationFrame(ensure) }
      new MutationObserver(sched).observe(document.body, { childList: true, subtree: true });
      document.addEventListener('change', function (e) { if (e.target.closest && e.target.closest('#fb')) sync() });
      (MQ.addEventListener ? MQ.addEventListener.bind(MQ, 'change') : MQ.addListener.bind(MQ))(function () {
        var w = document.querySelector('.fbc'); if (w) { w.style.removeProperty('--fbh'); if (!MQ.matches) w.classList.remove('open') }
        if (!MQ.matches) { isOpen = false; sync() }
      });
      ensure();
    })();
  </script>
</body>

</html>
