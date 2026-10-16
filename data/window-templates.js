/* 29 个应用窗口的标记，逐字节取自原 desktop.html 的第 929–3293 行。
 *
 * 为什么整块保留而不是按应用拆成 29 个片段：
 *   window.js 在解析期把 .window 与 .window>.titbar 两个 NodeList 按下标一一配对
 *   （见 module/window.js 的拖拽绑定），窗口的**文档顺序**是承重的；
 *   区域里还夹着 #window-fill、.msg.update 等非窗口元素。
 *   整块原样注入可以保证重建出来的 DOM 与原来完全一致。
 *
 * 注意：这里不能出现 <script> —— 经 insertAdjacentHTML 注入的脚本不会执行。
 *   Edge 收藏栏原本内联在此处的 add_save() 已移至 scripts/edge-bookmarks.js。
 *   <style> 不受影响，注入后照常生效，故保留原位。
 */
'use strict';
const windowMarkup = `	<div class="window defender" data-min-width="800" style="width: max(800px, 70%)">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/defender.svg" class="icon">
			<p data-i18n="defender.name">UEG 安全中心</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('defender')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('defender')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('defender')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/defender.svg" class="icon">
		</div>
		<div class="content" id="win-defender">
			<div class="app-left">
				<button class="close-menu">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
						class="feather feather-x">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				<ul class="nav-list">
					<li class="nav-list-item active">
						<a class="nav-list-link">
							<icon></icon>
							<span data-i18n="home">主页</span>
						</a>
					</li>
					<li class="nav-list-item">
						<a class="nav-list-link">
							<icon></icon>
							<span data-i18n="defender.virus">病毒威胁与防护</span>
						</a>
					</li>
					<li class="nav-list-item">
						<a class="nav-list-link">
							<icon></icon>
							<span data-i18n="defender.account">账户防护</span>
						</a>
					</li>
					<li class="nav-list-item">
						<a class="nav-list-link">
							<icon></icon>
							<span data-i18n="defender.firewall">防火墙和网络防护</span>
						</a>
					</li>
					<li class="nav-list-item">
						<a class="nav-list-link">
							<icon></icon>
							<span data-i18n="defender.device">设备安全性</span>
						</a>
					</li>
				</ul>
			</div>
			<div class="app-main">
				<div class="main-header-line">
					<h1 data-i18n="defender.glance">安全性概览</h1>
					<div class="action-buttons">
						<button class="open-right-area">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
								fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round" class="feather feather-activity">
								<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
							</svg>
						</button>
						<button class="menu-button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
								fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
								stroke-linejoin="round" class="feather feather-menu">
								<line x1="3" y1="12" x2="21" y2="12" />
								<line x1="3" y1="6" x2="21" y2="6" />
								<line x1="3" y1="18" x2="21" y2="18" />
							</svg>
						</button>
					</div>
				</div>
				<div class="chart-row three">
					<div class="chart-container-wrapper">
						<div class="chart-container">
							<div class="chart-info-wrapper">
								<h2 data-i18n="defender.network">网络流量使用</h2>
								<span>20.5 M</span>
							</div>
							<div class="chart-svg">
								<svg viewBox="0 0 36 36" class="circular-chart pink">
									<path class="circle-bg" d="M18 2.0845
							a 15.9155 15.9155 0 0 1 0 31.831
							a 15.9155 15.9155 0 0 1 0 -31.831"></path>
									<path class="circle" stroke-dasharray="30, 100" d="M18 2.0845
							a 15.9155 15.9155 0 0 1 0 31.831
							a 15.9155 15.9155 0 0 1 0 -31.831"></path>
									<text x="18" y="20.35" class="percentage">30%</text>
								</svg>
							</div>
						</div>
					</div>
					<div class="chart-container-wrapper">
						<div class="chart-container">
							<div class="chart-info-wrapper">
								<h2 data-i18n="defender.speed">网络速度</h2>
								<span>99 M/S</span>
							</div>
							<div class="chart-svg">
								<svg viewBox="0 0 36 36" class="circular-chart blue">
									<path class="circle-bg" d="M18 2.0845
							a 15.9155 15.9155 0 0 1 0 31.831
							a 15.9155 15.9155 0 0 1 0 -31.831"></path>
									<path class="circle" stroke-dasharray="60, 100" d="M18 2.0845
							a 15.9155 15.9155 0 0 1 0 31.831
							a 15.9155 15.9155 0 0 1 0 -31.831"></path>
									<text x="18" y="20.35" class="percentage">99M/S</text>
								</svg>
							</div>
						</div>
					</div>
					<div class="chart-container-wrapper">
						<div class="chart-container">
							<div class="chart-info-wrapper">
								<h2 data-i18n="defender.clearv">入侵病毒清除</h2>
								<h3 style="color: white;" data-i18n="defender.allvc">所有病毒均被清除</h3>
							</div>
							<div class="chart-svg">
								<svg viewBox="0 0 36 36" class="circular-chart orange">
									<path class="circle-bg" d="M18 2.0845
							a 15.9155 15.9155 0 0 1 0 31.831
							a 15.9155 15.9155 0 0 1 0 -31.831"></path>
									<path class="circle" stroke-dasharray="100, 100" d="M18 2.0845
							a 15.9155 15.9155 0 0 1 0 31.831
							a 15.9155 15.9155 0 0 1 0 -31.831"></path>
									<text x="18" y="20.35" class="percentage">100%</text>
								</svg>
							</div>
						</div>
					</div>
				</div>
				<div class="chart-row two">
					<div class="chart-container-wrapper big">
						<div class="chart-container">
							<div class="chart-container-header">
								<h2 data-i18n="defender.freq">电脑受病毒攻击频率</h2>
								<span>过去 30 天</span>
							</div>
							<div class="line-chart">
								<canvas id="chart"></canvas>
							</div>
							<div class="chart-data-details">
								<div class="chart-details-header"></div>
							</div>
						</div>
					</div>
					<div class="chart-container-wrapper small">
						<div class="chart-container">
							<div class="chart-container-header">
								<h2 data-i18n="defender.netreq">网络通信比例</h2>
								<span href="#" data-i18n="defender.netreq-thismonth">这个月</span>
							</div>
							<div class="acquisitions-bar">
								<span class="bar-progress rejected" style="width:1%;"></span>
								<span class="bar-progress shortlisted" style="width:5%;"></span>
								<span class="bar-progress on-hold" style="width:19%;"></span>
								<span class="bar-progress applications" style="width:80%;"></span>
							</div>
							<div class="progress-bar-info">
								<span class="progress-color applications"></span>
								<span class="progress-type">请求成功</span>
								<span class="progress-amount">80%</span>
							</div>
							<div class="progress-bar-info">
								<span class="progress-color shortlisted"></span>
								<span class="progress-type">请求失败</span>
								<span class="progress-amount">5%</span>
							</div>
							<div class="progress-bar-info">
								<span class="progress-color on-hold"></span>
								<span class="progress-type">请求发出后无响应</span>
								<span class="progress-amount">19%</span>
							</div>
							<div class="progress-bar-info">
								<span class="progress-color rejected"></span>
								<span class="progress-type">含有病毒</span>
								<span class="progress-amount">1%</span>
							</div>
						</div>
						<div class="chart-container applicants">
							<div class="chart-container-header">
								<h2 data-i18n="defender.recreq">请求记录</h2>
								<span>今天 仅展示最近 5 次请求</span>
							</div>
							<div class="applicant-line">
								<div class="applicant-info">
									<span>Https-Get</span>
									<p>Get url : <strong>szyinnovationstudio.github......</strong></p>
								</div>
							</div>
							<div class="applicant-line">
								<div class="applicant-info">
									<span>Https-Post</span>
									<p>Post url :<strong>api.github.com/r......</strong></p>
								</div>
							</div>
							<div class="applicant-line">
								<div class="applicant-info">
									<span>Https-Get</span>
									<p>Get url :<strong>cdn.jsdelivr.net/p......</strong></p>
								</div>
							</div>
							<div class="applicant-line">
								<div class="applicant-info">
									<span>Https-Get</span>
									<p>Get url :<strong>550wos-server.freeh......</strong></p>
								</div>
							</div>
							<div class="applicant-line">
								<div class="applicant-info">
									<span>Https-Get</span>
									<p>Get url :<strong>github.com/szyinnovationst......</strong></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="window-fill"></div>

	<div class="window msstore">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/msstore.svg" class="icon">
			<p>UEG Store</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('msstore');"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('msstore')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('msstore')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback" data-delay="3500">
			<img src="icon/msstore.svg" class="icon">
            <loading style="position: static; ">
                <svg width="40px" height="40px" viewBox="0 0 16 16">
                    <!-- <circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;"></circle> -->
                    <circle cx="8px" cy="8px" r="7px" style="stroke:#707070;stroke-width:3px;"></circle>
                </svg>
            </loading>
		</div>

		<div class="content" id="win-msstore">
			<div class="menu">
				<list class="focs">
					<a class="home check" onclick="apps.msstore.page('home');"><icon></icon><span class="t2" data-i18n="home">首页</span></a>
					<a class="apps" onclick="apps.msstore.page('apps');"><icon></icon><span class="t2" data-i18n="msstore.apps">应用</span></a>
					<a class="game" onclick="apps.msstore.page('game');"><icon></icon><span class="t2" data-i18n="msstore.games">游戏</span></a>
					<a class="down" onclick="apps.msstore.page('down');"><icon></icon><span class="t2" data-i18n="msstore.download">下载</span></a>
					<span class="focs"></span>
				</list>
			</div>
			<div class="page">
				<div class="cnt home show">
					<div class="container">
						<div class="cards"></div>
						<div class="apps">
							<div class="tit" data-i18n="msstore.topfree">热门免费应用 ></div>
							<div class="app-cards">
								<div class="card1">
									<div class="left"></div>
									<div class="right">
										<div class="tit">
											<div class="up">
												<div class="name">Visual Studio Code</div>
												<div class="type" data-i18n="msstore.free">免费下载</div>
											</div>
											<div class="down">
												<div class="rating"></div>
												<div class="cate" data-i18n="msstore.devtool">开发</div>
											</div>
										</div>
									</div>
								</div>
								<div class="card2">
									<div class="left"></div>
									<div class="right">
										<div class="tit">
											<div class="up">
												<div class="name" data-i18n="msstore.genimp">原神</div>
												<div class="type" data-i18n="msstore.free">免费下载</div>
											</div>
											<div class="down">
												<div class="rating"></div>
												<div class="cate" data-i18n="msstore.game">游戏</div>
											</div>
										</div>
									</div>
								</div>
								<div class="card3">
									<div class="left"></div>
									<div class="right">
										<div class="tit">
											<div class="up">
												<div class="name" data-i18n="msstore.mc">我的世界</div>
												<div class="type" data-i18n="msstore.free">免费下载</div>
											</div>
											<div class="down">
												<div class="rating"></div>
												<div class="cate" data-i18n="msstore.game">游戏</div>
											</div>
										</div>
									</div>
								</div>
								<div class="card4">
									<div class="left"></div>
									<div class="right">
										<div class="tit">
											<div class="up">
												<div class="name">Krita</div>
												<div class="type" data-i18n="msstore.free">免费下载</div>
											</div>
											<div class="down">
												<div class="rating"></div>
												<div class="cate" data-i18n="msstore.design">设计</div>
											</div>
										</div>
									</div>
								</div>
								<div class="card5">
									<div class="left"></div>
									<div class="right">
										<div class="tit">
											<div class="up">
												<div class="name">VirtualBox</div>
												<div class="type" data-i18n="msstore.free">免费下载</div>
											</div>
											<div class="down">
												<div class="rating"></div>
												<div class="cate" data-i18n="msstore.tool">工具</div>
											</div>
										</div>
									</div>
								</div>
								<div class="card6">
									<div class="left"></div>
									<div class="right">
										<div class="tit">
											<div class="up">
												<div class="name">LibreOffice</div>
												<div class="type" data-i18n="msstore.free">免费下载</div>
											</div>
											<div class="down">
												<div class="rating"></div>
												<div class="cate" data-i18n="msstore.business">办公</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="cnt apps"></div>
				<div class="cnt game"></div>
				<div class="cnt down"></div>
			</div>
		</div>
	</div>

	<div class="window setting">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/setting.svg" class="icon">
			<p data-i18n="setting.name">设置</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('setting')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('setting')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('setting')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/setting.svg" class="icon">
		</div>
		<div class="content" id="win-setting">
			<div class="menu">
				<a class="a user" onclick="$('#win-setting>.menu>list>a.user')[0].click();">
					<svg viewBox="0,0,257,344" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" overflow="hidden"><defs><clipPath id="user-clip1"><rect x="382" y="195" width="257" height="344" /></clipPath><linearGradient x1="351.462" y1="233.56" x2="669.496" y2="500.422" gradientUnits="userSpaceOnUse" spreadMethod="reflect" id="user-fill3"><stop offset="0" stop-color="#848484" /><stop offset="0.35" stop-color="#848484" /><stop offset="0.87" stop-color="#777777" /><stop offset="1" stop-color="#777777" /></linearGradient><linearGradient x1="351.462" y1="233.56" x2="669.496" y2="500.422" gradientUnits="userSpaceOnUse" spreadMethod="reflect" id="user-fill4"><stop offset="0" stop-color="#848484" /><stop offset="0.35" stop-color="#848484" /><stop offset="0.87" stop-color="#777777" /><stop offset="1" stop-color="#777777" /></linearGradient></defs><g clip-path="url(#user-clip1)" transform="translate(-382 -195)"><path d="M637.755 433.872C642.215 515.221 579.577 537.983 508.011 537.983 436.444 537.983 376.676 507.833 383.513 437.11 383.109 425.234 389.59 414.133 398.634 409.891 413.82 402.768 444.753 402.936 507.484 402.997 570.214 403.058 609.164 402.279 621.521 407.947 633.878 413.614 638.011 424.609 637.755 433.872Z" fill="url(#user-fill3)" fill-rule="evenodd" /><path d="M422 285C422 235.847 461.623 196 510.5 196 559.377 196 599 235.847 599 285 599 334.153 559.377 374 510.5 374 461.623 374 422 334.153 422 285Z" fill="url(#user-fill4)" fill-rule="evenodd" /></g></svg>
					<div>
						<p data-i18n="setting.usrname">Hengyu Tu</p>
						<p>tuhengyu@ueg.gov</p>
					</div>
				</a>
				<input type="text" class="input" placeholder="查找设置" style="padding-left: 30px;" data-i18n-attr="placeholder" data-i18n-key="setting.sch">
				<input-before class="bi bi-search"></input-before>
				<list class="focs">
					<a class="enable home check" onclick="apps.setting.page('home')"><img src="apps/icons/setting/home.png"><span data-i18n="home">主页</span></a>
					<a class="enable system" onclick="apps.setting.page('system')"><img src="apps/icons/setting/system.png"><span data-i18n="setting.system">系统</span></a><!-- 系统  stsc 远古-->
					<a class="enable blueteeth" onclick="apps.setting.page('blueteeth')"><img src="apps/icons/setting/blueteeth.png"><span data-i18n="setting.device">蓝牙和其他设备</span></a>
					<a class="enable network" onclick="apps.setting.page('network')"><img src="apps/icons/setting/network.png"><span data-i18n="setting.network">网络和 Internet</span></a>
					<a class="enable appearance avlb" onclick="apps.setting.page('appearance')"><img src="apps/icons/setting/personal.png"><span data-i18n="setting.psnl">个性化</span></a><!-- 个性化  stsc 远古-->
					<a class="enable apps" onclick="apps.setting.page('apps')"><img src="apps/icons/setting/apps.png"><span data-i18n="setting.apps">应用</span></a>
					<a class="enable user" onclick="apps.setting.page('user')"><img src="apps/icons/setting/user.png"><span data-i18n="setting.accounts">账户</span></a>
					<a class="enable time avlb" onclick="apps.setting.page('time')"><img src="apps/icons/setting/time.png"><span data-i18n="setting.timelang">时间和语言</span></a>
					<a class="enable game" onclick="apps.setting.page('game')"><img src="apps/icons/setting/game.png"><span data-i18n="setting.game">游戏</span></a>
					<a><img src="apps/icons/setting/help.png"><span data-i18n="setting.acc">辅助功能</span></a>
					<a class="enable safe avlb" onclick="apps.setting.page('safe')"><img src="apps/icons/setting/safe.png"><span data-i18n="setting.privacy">隐私和安全性</span></a>
					<a class="enable update avlb" onclick="apps.setting.page('update')"><img src="apps/icons/setting/update.png"><span data-i18n="setting.update">UEG 更新</span></a><!-- 更新  stsc 远古-->
					<span class="focs"></span>
				</list>
			</div>
			<div class="page">
				<!-- 主页  begin -->
				<div class="cnt home show">
					<p class="title">主页</p>
					<div style="display: flex;margin: 25px;width: 100%;">
						<p class="s-icon" style="font-size: 70px;margin: -8px 10px 0px 20px;"></p>
						<div>
							<p style="font-size: 28px;text-overflow: ellipsis;white-space: nowrap;">550W-MOSS</p>
							<p style="color: #7f7f7f;margin:-8px 0 -5px 0;">550W</p>
							<a style="color: var(--href);text-decoration: underline !important;;" class="a" onclick="shownotice('rename-pc')">重命名</a>
						</div>
					</div>
					<!-- <div style="display: flex;"></div> -->
					<div class="divider">
						<div>
					<div class="setting-card">
						<img src="icon/logo.svg" style="width: 35px; height: 35px;margin: 5px;">
						<span style="font-size: 18px;">所有功能尽在 UEG 账户</span>
						<span style="font-size: 14px;color:var(--text2)">登录后，即可在设备上使用你最喜爱的 UEG 应用和服务。可以备份设备、让设备更安全，并使用 UEG 365 应用版和云储存空间。</span>
						<a class="a button" onclick="window.location.href='./bluescreen.html?code=YOU_CAN_NOT_SIGN_IN_YOUR_UEG_ACCOUNT'" win12_title="BSOD is coming!" style="width: 100px;">登录</a>
					</div>
					<div class="setting-card">
						<p>推荐设置<br><span style="font-size: 14px;color:var(--text2)">最近使用的和常用的设置</span></p>
						<div class="setting-list">
							<a onclick="$('#win-setting>.menu>list>a.appearance')[0].click();">
								<icon>&#xE771;</icon><div><p>个性化</p><p>个性化你的系统</p></div><i class="bi bi-chevron-right"></i></a>
							<a onclick="$('#win-setting>.menu>list>a.safe')[0].click();">
								<icon>&#xE7EF;</icon><div><p>隐私与安全性</p><p>管理你的信息和数据</p></div><i class="bi bi-chevron-right"></i></a>
							<!-- <a><icon><i class="bi bi-power"></i></icon><div><p>电源和电池</p><p></p></div><i class="bi bi-chevron-right"></i></a>
							<a><icon><i class="bi bi-window-desktop"></i></icon><div><p>任务栏</p><p></p></div><i class="bi bi-chevron-right"></i></a>
							<a><icon><i class="bi bi-camera"></i></icon><div><p>摄像头</p><p></p></div><i class="bi bi-chevron-right"></i></a> -->
						</div>
					</div>
					</div>
					<div>
					<div class="setting-card">
						<p>个性化<br><span style="font-size: 14px;color:var(--text2)">个性化你的系统</span></p>
						<div class="setting-list">
							<a onclick="$('#win-setting>.menu>list>a.appearance')[0].click();"><icon>&#xE58E;</icon><div><p>平滑圆角</p><p>启用平滑圆角</p></div><i class="bi bi-chevron-right"></i></a>
							<a onclick="$('#win-setting>.menu>list>a.appearance')[0].click();"><icon>&#xE621;</icon><div><p>Mica 背景</p><p>为焦点窗口开启 Mica 效果</p></div><i class="bi bi-chevron-right"></i></a>
						</div>
					</div>
					<div class="setting-card">
						<p>蓝牙设备<br><span style="font-size: 14px;color:var(--text2)">管理、添加和删除设备</span></p>
						<div class="setting-list">
							<a onclick="$('#win-setting>.menu>list>a.blueteeth')[0].click();"><icon>&#xE702;</icon><div><p>蓝牙</p><p></p></div><i class="bi bi-chevron-right"></i></a>
						</div>
					</div>
					</div></div>
					<div style="height: 60px;"></div>
				</div>
				<!-- 主页  end -->
				<div class="cnt system">
					<p class="title">系统</p>
					<div style="display: flex;">
						<p class="s-icon" style="font-size: 70px;margin: -8px 10px 0px 20px;"></p>
						<div>
							<p style="font-size: 28px;text-overflow: ellipsis;white-space: nowrap;">550W-MOSS</p>
							<p style="color: #7f7f7f;margin:-8px 0 -5px 0;">550W</p>
							<a style="color: var(--href);text-decoration: underline !important;;" class="a" onclick="shownotice('rename-pc')">重命名</a>
						</div>
					</div>
					<div class="setting-list">
						<a><icon></icon><div><p>屏幕</p><p>显示器、亮度、夜间模式、显示描述</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>声音</p><p>声音级别、输入、输出、声音设备</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>通知</p><p>来自系统和应用的警报</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>专注</p><p>通知、自动规则</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon class="b">&#xF186;</icon><div><p>电源和电池</p><p>睡眠、电池使用情况、节电模式</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>存储</p><p>存储空间、驱动器、配置规则</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>多任务处理</p><p>贴靠窗口、桌面、任务切换</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>激活</p><p>激活状态、订阅、产品密钥</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>疑难解答</p><p>建议的疑难解答、首选项和历史记录</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>恢复</p><p>重置、高级启动、返回</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>投影到此电脑</p><p>权限、配对 PIN、可发现性</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>远程桌面</p><p>远程桌面用户、连接权限</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>剪贴板</p><p>剪贴和复制历史记录、同步、清除</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>系统信息</p><p>设备规格、重命名电脑、550WOS 规格</p></div><i class="bi bi-chevron-right"></i></a>
					</div>
				</div>
				<!-- 蓝牙与设备 -->
				<div class="cnt blueteeth">
					<p class="title">蓝牙与设备</p>
					<div style="display: flex;">
						<p class="s-icon" style="font-size: 70px;margin: -8px 10px 0px 20px;"></p>
						<div>
							<p style="color: #7f7f7f;margin:-8px 0 -5px 0;">我的蓝牙名称</p>
							<p style="font-size: 28px;text-overflow: ellipsis;white-space: nowrap;">Blueteeth-550W</p>
							<p class="blueteeth-tips-text" style="color: #7f7f7f;margin:-8px 0 -5px 0;">这是您在其他设备的蓝牙列表中的名称</p>
							<a style="color: var(--href);text-decoration: underline !important;;" class="a">重命名</a>
						</div>
					</div>
					<div class="setting-list">
						<a><icon></icon><div><p>连接</p><p>搜索新的蓝牙设备</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>设备</p><p>蓝牙鼠标、键盘、其他蓝牙设备</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>打印机和扫描仪</p><p>设置打印机、排除故障</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>移动设备</p><p>立即从电脑访问移动设备</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>触摸板</p><p>点击、滚动、缩放、手势</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>笔和 550WOS Ink</p><p>设置触控笔、设置触控屏幕</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>USB</p><p>通知、USB 节电模式</p></div><i class="bi bi-chevron-right"></i></a>
					</div>
				</div>
				<!-- 蓝牙与设备 end -->
				<!-- 网络和 Internet -->
				<div class="cnt network">
					<p class="title">网络和 Internet</p>
					<div style="display: flex;">
						<p class="s-icon" style="font-size: 70px;margin: -8px 15px 0px 20px;"></p>
						<div>
							<p style="color: #7f7f7f;margin:-8px 0 -5px 0;">WLAN 已连接</p>
							<p style="font-size: 28px;text-overflow: ellipsis;white-space: nowrap;">UEG - 5G</p>
							<a style="color: var(--href);text-decoration: underline !important;;" class="a">断开</a>
						</div>
					</div>
					<div class="setting-list">
						<a><icon></icon><div><p>WLAN</p><p>连接、管理已连接网络</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>移动网络 未连接</p><p>通过移动网络访问互联网</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>VPN</p><p>添加、连接、管理</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>移动热点</p><p>共享 Internet 连接</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>飞行模式</p><p>停止无线通信</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>代理</p><p>用于 WI-Fi 和以太网的代理服务器</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>拨号</p><p>设置拨号 Internet 连接</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>高级网络设置</p><p>查看所有网络适配器、网络重置</p></div><i class="bi bi-chevron-right"></i></a>
					</div>
				</div>
				<!-- 网络和 Internet end -->
				<div class="cnt appearance">
					<p class="title" data-i18n="setting.psnl">个性化</p>
					<div class="setting-list" style="margin-top: 10px;">
						<div><icon>&#xE58E;</icon><div><p data-i18n="setting.psnl.round">平滑圆角</p><p data-i18n="setting.psnl.round-dt">启用平滑圆角（需要较新浏览器）</p></div>
							<div class="alr" id="toggle-corner-squ">
								<a class="a checkbox checked" id="sys_setting_1" onclick="sys_setting[0]=1-sys_setting[0];$(this).toggleClass('checked',sys_setting[0]);$(':root').toggleClass('corner_squ',sys_setting[0]);saveDesktop();"></a>
							</div>
						</div>
						<div><icon></icon><div><p data-i18n="setting.psnl.animation">动画</p><p data-i18n="setting.psnl.animation-dt">系统界面元素过渡动画</p></div>
							<div class="alr">
								<a class="a checkbox checked" id="sys_setting_2" onclick="sys_setting[1]=1-sys_setting[1];$(this).toggleClass('checked', !sys_setting[1]);$(':root').toggleClass('notrans', !sys_setting[1]);saveDesktop();"></a>
							</div>
						</div>
						<div><icon></icon><div><p data-i18n="setting.psnl.shadow">阴影</p><p data-i18n="setting.psnl.shadow-dt">为系统界面元素添加阴影效果</p></div>
							<div class="alr">
								<a class="a checkbox checked" id="sys_setting_3" onclick="sys_setting[2]=1-sys_setting[2];$(this).toggleClass('checked',!sys_setting[2]);$(':root').toggleClass('nosd',!sys_setting[2]);saveDesktop();"></a>
							</div>
						</div>
						<div><icon></icon><div><p data-i18n="setting.psnl.alltransp">多窗口透明</p><p data-i18n="setting.psnl.alltransp-dt">为所有窗口开启透明效果，而不是仅用于焦点窗口 <span class="a jump" win12_title="开启后将占用大量 GPU，可能造成卡顿">详细</span></p></div>
							<div class="alr">
								<a class="a checkbox" id="sys_setting_4" onclick="sys_setting[3]=1-sys_setting[3];$(this).toggleClass('checked',sys_setting[3]);$(':root').toggleClass('moreblur',sys_setting[3]);saveDesktop();"></a>
							</div>
						</div>
						<div><icon>&#xE621;</icon><div><p data-i18n="setting.psnl.mica">Mica 背景</p><p data-i18n="setting.psnl.mica-dt">为焦点窗口开启 Mica 效果</p></div>
							<div class="alr">
								<a class="a checkbox" id="sys_setting_5" onclick="sys_setting[4]=1-sys_setting[4];$(this).toggleClass('checked',sys_setting[4]);$(':root').toggleClass('mica',sys_setting[4]);saveDesktop();"></a>
							</div>
						</div>
						<div><icon><i class="bi bi-music-note-beamed"></i></icon><div><p data-i18n="setting.psnl.startup-sound">开机音乐</p><p data-i18n="setting.psnl.startup-sound-dt">是否启用开机音乐</p></div>
							<div class="alr">
								<a class="a checkbox checked" id="sys_setting_6" onclick="sys_setting[5]=1-sys_setting[5];document.getElementById('sys_setting_6').setAttribute('class', 'a checkbox' + (sys_setting[5]?' checked':''));saveDesktop();"></a>
							</div>
						</div>
            <div><icon><i class="bi bi-mic-fill"></i></icon><div><p data-i18n="setting.psnl.ball">语音输入球</p><p data-i18n="setting.psnl.ball-dt">是否启用语音输入球</p></div>
							<div class="alr">
								<a class="a checkbox checked" id="sys_setting_7" onclick="sys_setting[6]=1-sys_setting[6];document.querySelector('.rainbow-container-main').setAttribute('style', 'display:' + (sys_setting[6] ? 'block' : 'none')+ ';');document.getElementById('sys_setting_7').setAttribute('class', 'a checkbox' + (sys_setting[6]?' checked':''));updateVoiceBallStatus();saveDesktop();"></a>
							</div>
						</div>
						<a class="dp advanced" onclick="$('.dp.advanced').toggleClass('show');">
							<icon>&#xE94F;</icon><div><p>高级设置</p><p>WebGL 等高级设置</p></div><i class="bi bi-chevron-down"></i>
						</a>
						<div class="dp advanced" style="padding: 15px;">
							<div style="margin-top: 18px;">
								<p>WebGL <span style="color: var(--text2); font-size: 12px;">Beta</span></p>
								<p style="color: var(--text2); font-size: 13px;">启用硬件加速视觉效果；不可用时自动使用普通渲染。默认关闭。</p>
								<div class="webgl-selector" id="webgl-mode" role="radiogroup" aria-label="WebGL 渲染级别">
									<div class="webgl-selector-options">
										<a role="radio" data-value="off" aria-checked="false" tabindex="-1" onclick="setWebGLMode('off')">关闭</a>
										<a role="radio" data-value="partial" aria-checked="false" tabindex="-1" onclick="setWebGLMode('partial')">部分</a>
										<a role="radio" data-value="full" aria-checked="false" tabindex="-1" onclick="setWebGLMode('full')">全部</a>
									</div>
								</div>
								<p class="webgl-hint" id="webgl-mode-hint" role="status" aria-live="polite">当前使用普通 DOM 渲染。</p>
							</div>
						</div>
					</div>
				</div>
				<!-- 应用 -->
				<div class="cnt apps">
					<p class="title">应用</p>
					<div class="setting-list">
						<a><icon></icon><div><p>安装的应用</p><p>已安装的应用程序、应用程序执行别名</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>默认应用</p><p>文件和链接类型的默认值，其他默认值</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>离线地图</p><p>下载、存储位置、地图更新</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>可选内容</p><p>为您的设备提供额外功能</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>可打开的网站应用</p><p>可以在应用程序而不是浏览器中打开的网站</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>视频播放</p><p>视频格式调整、HDR 流媒体、电池选项</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>启动</p><p>登录时自动启动的应用程序</p></div><i class="bi bi-chevron-right"></i></a>
					</div>
				</div>
				<!-- 应用 end -->
				<!-- 账户 -->
				<div class="cnt user">
					<p class="title">账户</p>
					<div style="display: flex;margin: 10px 5px;">
						<!-- <div style="display:flex"> -->
							<svg viewBox="0,0,257,344" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width: 100px;height: 100px;background-color: var(--hover-b);width: 60px;width: 60px;height: 60px;border-radius: 50%;padding: 15px;margin-right: 15px;margin-bottom: 15px;" overflow="hidden"><defs><clipPath id="user-clip1"><rect x="382" y="195" width="257" height="344" /></clipPath><linearGradient x1="351.462" y1="233.56" x2="669.496" y2="500.422" gradientUnits="userSpaceOnUse" spreadMethod="reflect" id="user-fill3"><stop offset="0" stop-color="#848484" /><stop offset="0.35" stop-color="#848484" /><stop offset="0.87" stop-color="#777777" /><stop offset="1" stop-color="#777777" /></linearGradient><linearGradient x1="351.462" y1="233.56" x2="669.496" y2="500.422" gradientUnits="userSpaceOnUse" spreadMethod="reflect" id="user-fill4"><stop offset="0" stop-color="#848484" /><stop offset="0.35" stop-color="#848484" /><stop offset="0.87" stop-color="#777777" /><stop offset="1" stop-color="#777777" /></linearGradient></defs><g clip-path="url(#user-clip1)" transform="translate(-382 -195)"><path d="M637.755 433.872C642.215 515.221 579.577 537.983 508.011 537.983 436.444 537.983 376.676 507.833 383.513 437.11 383.109 425.234 389.59 414.133 398.634 409.891 413.82 402.768 444.753 402.936 507.484 402.997 570.214 403.058 609.164 402.279 621.521 407.947 633.878 413.614 638.011 424.609 637.755 433.872Z" fill="url(#user-fill3)" fill-rule="evenodd" /><path d="M422 285C422 235.847 461.623 196 510.5 196 559.377 196 599 235.847 599 285 599 334.153 559.377 374 510.5 374 461.623 374 422 334.153 422 285Z" fill="url(#user-fill4)" fill-rule="evenodd" /></g></svg>
							<div style="margin-top: 8px;">
								<p style="font-size: 19px;line-height: 1;">Hengyu Tu</p>
								<p>tuhengyu@ueg.gov</p>
							</div>
						<!-- </div> -->
					</div>
					<div class="setting-list">
						<a><img src="icon/logo.svg" style="width:20px;height:20px;margin:10px 20px 10px 5px;"><div><p>您的 UEG 账户</p><p>订阅、账单等</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>您的账户信息</p><p>电子邮件、日历和联系人使用的帐户</p></div><i class="bi bi-chevron-right"></i></a>
						<a class="dp sign-in-options" onclick="$('.dp.sign-in-options').toggleClass('show');win12RefreshPasswordSettingStatus();"><icon></icon><div><p>登录选项</p><p>550WOS Hello、安全密钥、密码、动态锁</p></div><i class="bi bi-chevron-down"></i></a>
						<div class="dp sign-in-options">
							<div class="setting-password">
								<div>
									<p>密码</p>
									<p id="setting-password-status">加载中</p>
								</div>
								<input id="setting-password-current" class="input" type="password" autocomplete="current-password" placeholder="当前密码">
								<input id="setting-password-new" class="input" type="password" autocomplete="new-password" placeholder="新密码" onkeydown="if(event.keyCode==13){win12SetLoginPassword();}">
								<a id="setting-password-submit" class="a button" onclick="win12SetLoginPassword();">保存</a>
							</div>
						</div>
						<a><icon></icon><div><p>电子邮件和账户</p><p>电子邮件、日历和联系人使用的帐户</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>家庭</p><p>管理您的家庭群组、编辑帐户类型和设备权限</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>550WOS 备份</p><p>备份您的文件、应用程序、首选项以跨设备恢复它们</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>其他用户</p><p>设备访问、工作或学校用户、信息亭分配的访问</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon></icon><div><p>登录工作或学校账户</p><p>电子邮件、应用程序和网络等组织资源</p></div><i class="bi bi-chevron-right"></i></a>
					</div>
				</div>
				<!-- 账户 end -->
				<!-- 时间 -->
				<div class="cnt time">
					<div class="time-panel overview show">
						<p class="title" data-i18n="setting.timelang">时间和语言</p>
						<div class="settingTimeItem">
							<p class="settingTimeTitle" data-i18n="setting.currentTime">当前设备时间：</p>
							<span class="settingTime"></span>
						</div>
						<div class="setting-list">
							<a class="time-option" onclick="apps.setting.timePanel('date')"><icon></icon><div><p data-i18n="setting.dateTime">日期与时间</p><p data-i18n="setting.dateTimeDesc">时区、自动时钟设置、日历显示</p></div><i class="bi bi-chevron-right"></i></a>
							<a class="time-option" onclick="apps.setting.timePanel('language')"><icon></icon><div><p data-i18n="setting.languageRegion">语言和区域</p><p data-i18n="setting.languageRegionDesc">550WOS 和某些应用程序根据您所在的地区设置日期和时间的格式</p></div><i class="bi bi-chevron-right"></i></a>
							<a><icon></icon><div><p>输入</p><p>触摸键盘、文本建议、首选项</p></div><i class="bi bi-chevron-right"></i></a>
							<a><icon></icon><div><p>语音</p><p>语音语言、语音识别麦克风设置、声音</p></div><i class="bi bi-chevron-right"></i></a>
						</div>
					</div>
					<div class="time-panel date">
						<a class="time-back" onclick="apps.setting.timePanel('overview')"><i class="bi bi-arrow-left"></i><span data-i18n="setting.timelang">时间和语言</span></a>
						<p class="title" data-i18n="setting.dateTime">日期与时间</p>
						<div class="setting-card"><p data-i18n="setting.currentTime">当前设备时间：</p><span class="settingTime"></span></div>
					</div>
					<div class="time-panel language">
						<a class="time-back" onclick="apps.setting.timePanel('overview')"><i class="bi bi-arrow-left"></i><span data-i18n="setting.timelang">时间和语言</span></a>
						<p class="title" data-i18n="setting.languageRegion">语言和区域</p>
						<div class="setting-card language-card">
							<div><p data-i18n="setting.displayLanguage">550WOS 显示语言</p><p data-i18n="setting.displayLanguageDesc">选择应用于 550WOS 和应用程序的显示语言。</p></div>
							<div class="languageSelectControl">
								<select class="languageSelect" aria-label="550WOS display language" onchange="apps.setting.changeLanguage(this.value)">
									<option value="auto" data-i18n="setting.languageAuto">自动（根据设备语言）</option>
									<option value="zh-CN">简体中文</option>
									<option value="zh-TW">繁體中文</option>
									<option value="en">English</option>
								</select>
								<i class="bi bi-chevron-down"></i>
							</div>
						</div>
					</div>
				</div>
				<!-- 时间 end -->
				<!-- 游戏 begin -->
				<div class="cnt game">
					<p class="title">游戏</p>
					<div class="setting-list">
						<a><icon><i class="bi bi-xbox"></i></icon><div><p>Game Bar</p><p>控制器和键盘快捷方式</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon><i class="bi bi-camera"></i></icon><div><p>摄像</p><p>保存位置，录制首选项</p></div><i class="bi bi-chevron-right"></i></a>
						<a><icon><i class="bi bi-controller"></i></icon><div><p>游戏模式</p><p>优化电脑以便畅玩</p></div><i class="bi bi-chevron-right"></i></a>
					</div>
				</div>
				<!-- 游戏 end -->
				<div class="cnt safe">
					<p class="title">隐私和安全性</p>
					<div class="setting-list">
						<a onclick="localStorage.setItem('desktop','[]');setIcon();">
							<icon><i class="bi bi-trash3"></i></icon>
							<div>
								<p>清除桌面图标</p>
								<p>这将清除用户自定义的所有图标</p>
							</div><i class="bi bi-chevron-right"></i>
						</a>
						<a onclick="$('.dp.access-token').toggleClass('show')" class="dp access-token">
							<icon><i class="bi bi-key"></i></icon>
							<div>
								<p>Token 管理</p>
								<p>添加或删除 GitHub Access Token</p>
							</div>
							<i class="bi bi-chevron-down"></i>
						</a>
						<div class="dp access-token">
							<input type="text" class="token input">
							<div class="container" style="display: flex; align-items: center; gap: 10px; justify-content: space-evenly; margin-top: 6px;">
								<div class="button" onclick="localStorage.setItem('token', $('.dp.access-token>input.token').val());">保存 Token</div>
								<div class="button" onclick="localStorage.setItem('token', '');">清除 Token</div>
								<div class="button" onclick="$('.dp.access-token>input.token').val(localStorage.getItem('token'));">查看 Token</div>
							</div>
							<div class="detail" style="font-size: 0.8em; color: var(--text2);">您可以在这里填入您的 Github Access Token 来提高 Github API 限制访问次数，即可以更好地使用 UEG 更新、主题等功能。您的 Token 仅会存放在本地浏览器中，该数据不会传输至服务端，也更不会外泄，但请您妥善保管好自己的 Token。</div>
						</div>
					</div>
				</div>
				<div class="cnt update">
					<p class="title">UEG 更新</p>
					<div class="lo">
						<svg viewBox="0 0 65 65" version="1.1" id="svg5" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs2"><linearGradient id="linearGradient12966"><stop style="stop-color:#4e4e4e;stop-opacity:1;" offset="0" id="stop12962"/><stop style="stop-color:#b1b1b1;stop-opacity:1;" offset="1" id="stop12964"/></linearGradient><linearGradient id="linearGradient10659"><stop style="stop-color:#3b3b3b;stop-opacity:1;" offset="0" id="stop10655"/><stop style="stop-color:#8e8e8e;stop-opacity:1;" offset="1" id="stop10657"/></linearGradient><linearGradient xlink:href="#linearGradient10659" id="linearGradient10661" x1="40.558044" y1="64.876854" x2="103.16348" y2="64.876854" gradientUnits="userSpaceOnUse"/><linearGradient xlink:href="#linearGradient10659" id="linearGradient12869" gradientUnits="userSpaceOnUse" x1="40.558044" y1="64.876854" x2="103.16348" y2="64.876854"/><linearGradient xlink:href="#linearGradient10659" id="linearGradient12871" gradientUnits="userSpaceOnUse" x1="40.558044" y1="64.876854" x2="103.16348" y2="64.876854"/><linearGradient xlink:href="#linearGradient12966" id="linearGradient12968" x1="40.558044" y1="64.876854" x2="103.16348" y2="64.876854" gradientUnits="userSpaceOnUse"/><linearGradient xlink:href="#linearGradient12966" id="linearGradient13788" gradientUnits="userSpaceOnUse" x1="40.558044" y1="64.876854" x2="103.16348" y2="64.876854"/><linearGradient xlink:href="#linearGradient12966" id="linearGradient13790" gradientUnits="userSpaceOnUse" x1="40.558044" y1="64.876854" x2="103.16348" y2="64.876854"/></defs><g id="layer1"><g id="g8420" transform="rotate(-173.25016,50.599831,57.584909)" style="stroke:url(#linearGradient10661)"><path style="fill:none;stroke:url(#linearGradient12869);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none" id="path234-2" d="M 43.058046,79.121117 A 28.487005,28.487005 0 0 1 66.602472,51.066164 28.487005,28.487005 0 0 1 98.316952,69.38588"/><path style="fill:none;stroke:url(#linearGradient12871);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none" d="M 85.756154,73.849626 100.66351,72.185133 98.999027,57.27777" id="path1617-6"/></g><g id="g8420-2" transform="rotate(6.74984,459.81282,-281.39813)" style="stroke:url(#linearGradient12968);stroke-opacity:1"><path style="fill:none;stroke:url(#linearGradient13788);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" id="path234-2-2" d="M 43.058046,79.121117 A 28.487005,28.487005 0 0 1 66.602472,51.066164 28.487005,28.487005 0 0 1 98.316952,69.38588"/><path style="fill:none;stroke:url(#linearGradient13790);stroke-width:5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1" d="M 85.756154,73.849626 100.66351,72.185133 98.999027,57.27777" id="path1617-6-0"/></g></g></svg>
						<div class="update-main">
							<div class="part">
								<p class="notice">正在检查更新...</p>
								<p class="detail"></p>
							</div>
							<div><a class="a button update-check" onclick="apps.setting.checkUpdate(true)" style="font-size: 16px;margin-top: -7.5px;">检查更新</a></div>
						</div>
					</div>
					<div class="setting-list">
						<a onclick="openapp('about');apps.about.page('update');" style="opacity: 0.5; pointer-events: none;"><icon>&#xE946;</icon><div><p>更新历史记录</p><p>查看历史版本功能</p></div><i class="bi bi-chevron-right"></i></a>
						<a class="update-release disabled"><icon>&#xE896;</icon><div><p>下载完整内容</p><p>检查后可打开 GitHub 最新发布页</p></div><i class="bi bi-chevron-right"></i></a>
						<div><icon></icon><div><p>自动更新</p><p>设置是否启用自动更新</p></div>
							<div class="alr">
								<a class="checkbox checked a" onclick="$(this).toggleClass('checked'); autoUpdate = !autoUpdate; localStorage.setItem('autoUpdate', autoUpdate)"></a>
							</div>
						</div>
						<a><icon></icon><div><p>UEG 预览体验计划</p><p>获取 UEG 的预览版本，以分享有关新功能的更新和反馈</p></div><i class="bi bi-chevron-right"></i></a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="window explorer tabs">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/explorer.svg" class="icon">
			<!-- <p style="width:min-content">文件资源管理器</p> -->
			<div class="tabs">
			</div>
			<div>
				<a class="a wbtg red" onclick="hidewin('explorer')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('explorer')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('explorer')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/explorer.svg" class="icon">
		</div>
		<div class="content" id="win-explorer">
			<div class="path">
				<a class="a btn btn-icon back" onclick="apps.explorer.back(apps.explorer.tabs[apps.explorer.now][0])"><i class="bi bi-arrow-left"></i></a>
				<a class="a btn btn-icon front" onclick="apps.explorer.front(apps.explorer.tabs[apps.explorer.now][0])"><i class="bi bi-arrow-right"></i></a>
				<a class="a btn btn-icon goback"><i class="bi bi-arrow-up"></i></a>
				<p class="tit"></p>
				<div class="search">
					<input type="text" class="input" placeholder="在这里输入你要搜索的内容" data-i18n-attr="placeholder" data-i18n-key="sch-ph">
				</div>
			</div>
			<div class="page">
				<div class="menu">
					<div class="card pinned">
						<p class="title"><span style="font: 15px;">📌</span> <span data-i18n="explorer.pinned">已固定</span></p>
						<list>
							<a onclick="shownotice('no-files-permission')"><img src="apps/icons/explorer/qa.png"><span data-i18n="explorer.quickacc">快速访问</span></a>
							<a onclick="shownotice('no-files-permission')"><img src="apps/icons/explorer/od.png">UEG Drive</a>
							<a class="check" onclick="apps.explorer.reset();"><span
									style="background:linear-gradient(180deg, var(--theme-1), var(--theme-2));width:4px;height: 19px;border-radius: 10px;margin-left: -12px;margin-right: 8px;margin-top: 1px;"></span>
								<img src="apps/icons/explorer/thispc.svg"><span data-i18n="explorer.thispc">此电脑</span></a>
							<a onclick="shownotice('no-files-permission')"><img src="apps/icons/explorer/rb.png"><span data-i18n="explorer.bin">回收站</span></a>
							<a id="explorer-mount-btn" onclick="apps.explorer.mountDrive()"><img src="apps/icons/explorer/disk.svg"><span data-i18n="explorer.mount">挂载本地文件夹</span></a>
						</list>
					</div>
					<div class="card tags">
						<p class="title"><span style="font: 15px;">🏷</span> <span data-i18n="explorer.tag">标签</span></p>
						<list>
							<a onclick="shownotice('no-files-permission')"><span style="background-color: red;"></span><span data-i18n="explorer.tag.red">红色</span></a>
							<a onclick="shownotice('no-files-permission')"><span style="background-color: #3981d9;"></span><span data-i18n="explorer.tag.blue">蓝色</span></a>
							<a onclick="shownotice('no-files-permission')"><span style="background-color: yellow;"></span><span data-i18n="explorer.tag.yellow">黄色</span></a>
							<a onclick="shownotice('no-files-permission')"><span style="background-color: green;"></span><span data-i18n="explorer.tag.green">绿色</span></a>
							<a onclick="shownotice('no-files-permission')"><span style="background-color: #fc9816;"></span><span data-i18n="explorer.tag.orange">橙色</span></a>
							<a onclick="shownotice('no-files-permission')"><span style="background-color: purple;"></span><span data-i18n="explorer.tag.purple">紫色</span></a>
							<a onclick="shownotice('no-files-permission')"><span style="background-color: #ffcad4;"></span><span data-i18n="explorer.tag.pink">粉色</span></a>
						</list>
					</div>
				</div>
				<div class="main">
					<div class="tool micaalt">
						<a class="a b t act"
							onclick="apps.explorer.add($('#win-explorer>.path>.tit')[0].dataset.path,'新建文本文档.txt')"><img
								src="apps/icons/explorer/tool-new.png"><span data-i18n="explorer.new">新建</span></a>
						<div class="hr"></div>
						<a class="a b act"><img src="apps/icons/explorer/tool-cut.png"></a>
						<a class="a b act"><img src="apps/icons/explorer/tool-copy.png"></a>
						<a class="a b act"><img src="apps/icons/explorer/tool-paste.png"></a>
						<a class="a b act"><img src="apps/icons/explorer/tool-rename.png"></a>
						<div class="hr"></div>
						<a class="a b t act"><img src="apps/icons/explorer/tool-sort.png"><span data-i18n="explorer.sort">排序方式</span></a>
						<a class="a b t act"><img src="apps/icons/explorer/tool-view.png"><span data-i18n="explorer.view">布局</span></a>
					</div>
					<div class="content" onclick="apps.explorer.del_select()"
						oncontextmenu="return showcm(event,'explorer.content',null);">
						<div class="view">
							<!-- 文件列表  -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="window calc">
		<div class="titbar">
			<img src="icon/calc.svg" class="icon">
			<p data-i18n="calc.name">计算器</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('calc')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" style="pointer-events: none;color: #777;"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('calc')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/calc.svg" class="icon">
		</div>
		<div class="content" id="win-calc">
			<div class="container">
			<input id="calc-input" readonly="true" value="0" onkeydown="
				switch (event.key) {
					case '+':
						appCalculator.func_key(1);
						appCalculator.check($('#win-calc>.keyb>.jia')[0]);
						break;
					case '-':
						appCalculator.func_key(2);
						appCalculator.check($('#win-calc>.keyb>.jian')[0]);
						break;
					case '*':
						appCalculator.func_key(3);
						appCalculator.check($('#win-calc>.keyb>.cheng')[0]);
						break;
					case '/':
						appCalculator.func_key(4);
						appCalculator.check($('#win-calc>.keyb>.chu')[0]);
						break;
					case '=':
						appCalculator.eq();
						break;
					case 'Enter':
						appCalculator.eq();
						break;
					case 'Backspace':
						appCalculator.backspace();
						break;
					case '.':
						appCalculator.point();
						break;
				}
				if (!isNaN(event.key)) {
					appCalculator.number_key(Number(event.key));
				}
			"></input>
			</div>
			
			<div class="keyb">
				<a class="a b" onclick="appCalculator.square('calc-input')">𝑥²</a>
				<a class="a b" onclick="appCalculator.squareRoot('calc-input')">√𝑥</a>
				<a class="a b" onclick="appCalculator.clear_num('calc-input')">C</a>
				<a class="a b u jia" onclick="appCalculator.func_key(1); appCalculator.check(this);">+</a>
				<a class="a b" onclick="appCalculator.number_key(7);">7</a>
				<a class="a b" onclick="appCalculator.number_key(8);">8</a>
				<a class="a b" onclick="appCalculator.number_key(9);">9</a>
				<a class="a b u jian" onclick="appCalculator.func_key(2); appCalculator.check(this);">-</a>
				<a class="a b" onclick="appCalculator.number_key(4);">4</a>
				<a class="a b" onclick="appCalculator.number_key(5);">5</a>
				<a class="a b" onclick="appCalculator.number_key(6);">6</a>
				<a class="a b u cheng" onclick="appCalculator.func_key(3); appCalculator.check(this);">×</a>
				<a class="a b" onclick="appCalculator.number_key(1);">1</a>
				<a class="a b" onclick="appCalculator.number_key(2);">2</a>
				<a class="a b" onclick="appCalculator.number_key(3);">3</a>
				<a class="a b u chu" onclick="appCalculator.func_key(4); appCalculator.check(this);">÷</a>
				<a class="a b" onclick="appCalculator.point()">.</a>
				<a class="a b" onclick="appCalculator.number_key(0);">0</a>
				<a class="a b" onclick="appCalculator.backspace('calc-input')"><i class="bi bi-backspace"></i></a>
				<a class="a b ans u" onclick="if(!appCalculator.eq('calc-input')){ appCalculator.clear_num(); shownotice('ZeroDivision')}">=</a>
			</div>
		</div>
	</div>
	<div class="window about">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/about.svg" class="icon">
			<p class="about-app-title" data-i18n="about.name">关于 550WOS</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('about')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('about')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('about')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/about.svg" class="icon">
		</div>
		<div class="content" id="win-about">
			<div class="menu">
				<!-- <list class="focs">
					<a onclick="$('#win-about>.about').addClass('show');$('#win-about>.update').removeClass('show');"><img src="apps/icons/about/info.svg" height="17px" width="19px"><span data-i18n="about.intro">简介</span></a>
					<a onclick="$('#win-about>.update').addClass('show');$('#win-about>.about').removeClass('show');"><img src="apps/icons/about/update.svg" height="20px" width="18px"><span data-i18n="about.update">更新记录</span></a>
				</list> -->

				<list class="about-menu">
					<a class="enable check about avlb" onclick="apps.about.page('about');">
						<span data-i18n="about.intro">简介</span></a>
					<a class="enable update avlb" onclick="apps.about.page('update');">
						<span data-i18n="about.update">更新记录</span></a>
				</list>
			</div>
			<div class="cnt about about-web">
				<h1 class="tit" data-i18n="about.intro.name"><span></span>550WOS</h1>
				<div style="margin-left: 20px;">
					<h2 class="tit" data-i18n="about.intro.intro"><span></span>简介</h2>
					<p data-i18n="about.intro.intro.p1">&emsp;&emsp;550WOS 是一个开源项目，由 ShiZhongyan 维护，使用 HTML、CSS 和 JavaScript，在网络上模拟、创新操作系统。</p>
					<p data-i18n="about.intro.intro.p2">&emsp;&emsp;此项目已发布至 GitHub，<a onclick="window.open('https://github.com/SZYInnovationStudio/550WOS','_blank');" win12_title="https://github.com/SZYInnovationStudio/550WOS" class="jump">点击此处查看</a>。</p>
					<p data-i18n="about.intro.intro.p3">&emsp;&emsp;若您对于该项目有任何意见或建议，请在 GitHub 上<a onclick="window.open('https://github.com/SZYInnovationStudio/550WOS/issues','_blank');" win12_title="https://github.com/SZYInnovationStudio/550WOS/issues" class="jump">提交 issues</a>，您的问题会被尽可能快地解决。</p>
					<p data-i18n="about.intro.intro.p4">&emsp;&emsp;本项目由开发者 ShiZhongyan 维护，点击以<a class="jump" win12_title="https://github.com/ShiZhongyanGH" onclick="window.open('https://github.com/ShiZhongyanGH','_blank')">了解详细</a>。</p>
					<p>&emsp;&emsp;本项目基于 Windows12（win12-online/win12）修改而来。</p>
					<h2 class="tit" data-i18n="about.intro.os"><span></span>开源说明</h2>
					<p data-i18n="about.intro.os.p1">&emsp;&emsp;此项目是一个开源项目，采用 Eclipse 基金会发行的 Eclipse Public License 2.0 许可证（网址:https://www.eclipse.org/legal/epl-2.0/）进行许可。在遵守该许可证的前提下，您可以自由使用本项目的源代码。</p>
					<p data-i18n="about.intro.os.p2">&emsp;&emsp;根据许可，你可以对该项目进行传播、分发、修改以及二次发布，包括个人和商业用途。</p>
					<p data-i18n="about.intro.os.p3">&emsp;&emsp;但您必须给出源码来源，<strong>包括作者，项目链接等</strong>，必须使用相同的协议开源。</p>
					<p data-i18n="about.intro.os.p4">&emsp;&emsp;不是在该项目基础上进行增加、修改的，仅参考源码的，不需要开源，但也仅供学习用途。</p>
					<h2 class="tit" data-i18n="about.intro.disclaimer"><span></span>免责声明</h2>
					<p data-i18n="about.intro.disclaimer.p1">&emsp;&emsp;550WOS（以下简称"本项目"）是一个<strong>非商业性的开源兴趣项目</strong>，由贡献者合作开发，旨在通过 Web 技术探索与模拟图形操作系统的交互体验。</p>
					<p data-i18n="about.intro.disclaimer.p2">&emsp;&emsp;本项目由 UEG 联合政府打造。</p>
					<p data-i18n="about.intro.disclaimer.p3">&emsp;&emsp;项目名称"550WOS"及类似表述，均为 UEG 联合政府的操作系统名称。</p>
					<p data-i18n="about.intro.disclaimer.p4">&emsp;&emsp;项目中一切界面布局设计、配色等视觉元素，系贡献者基于公开资料进行<strong>独立再创作</strong>的结果，不曾直接复制、修改或分发 UEG 的原始可执行资产。</p>
					<p data-i18n="about.intro.disclaimer.p5">&emsp;&emsp;大多数图标已由贡献者参考当前版本 550WOS 图标进行重绘；其余少数未重绘的图标，仅用于识别与展示目的，其版权归 UEG 联合政府所有。您应当充分了解到：本项目全部代码、素材及文档等仅供学习与技术研究之用途。您不得利用本项目实施任何侵犯 UEG 或其第三方权利人合法权益的行为。本项目贡献者不为任何对本项目的使用造成的结果承担任何责任。</p>
					<h2 class="tit" data-i18n="about.intro.contri"><span></span>贡献者</h2>
					<p data-i18n="about.intro.contri.p1">&emsp;&emsp;感谢所有项目的贡献者（实时数据，计算方法：即为 Commits 次数）</p>
					<div id="contri">
						<loading>
							<svg width="30px" height="30px" viewBox="0 0 16 16">
								<circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;">
								</circle>
								<circle cx="8px" cy="8px" r="7px" style="stroke:#707070;stroke-width:3px;"></circle>
							</svg>
						</loading>
					</div>
					<h2 class="tit"><span></span>Star</h2>
					<p data-i18n="about.intro.star.p1">&emsp;&emsp;感谢<a class="jump" win12_title="给个 Star 好不好？(即将跳转到：https://github.com/SZYInnovationStudio/550WOS/stargazers)" onclick="window.open('https://github.com/SZYInnovationStudio/550WOS/stargazers','_blank')">所有支持我们的人</a>。</p>
					<div id="StarShow">
						<loading>
							<svg width="30px" height="30px" viewBox="0 0 16 16">
								<circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;">
								</circle>
								<circle cx="8px" cy="8px" r="7px" style="stroke:#707070;stroke-width:3px;"></circle>
							</svg>
						</loading>
					</div>
					<h2 class="tit" data-i18n="about.intro.others"><span></span>其它</h2>
					<p data-i18n="about.intro.others.p1">&emsp;&emsp;此项目基于目前 550WOS 版本创造，与 UEG 的 550WOS 正式版本不一致。</p>
					<p data-i18n="about.intro.others.p2">&emsp;&emsp;本项目由 UEG 联合政府打造。</p>
					<p data-i18n="about.intro.others.p3">&emsp;&emsp;本项目中 UEG、550WOS 和其他示范产品是 UEG 联合政府的商标。本项目中 Android 是谷歌公司的商标。</p>
					<p data-i18n="about.intro.others.p4">&emsp;&emsp;若您在本项目（网址为 https://550w.szyd.fun）之外的网站看到此页面，那么您可能正在浏览一个镜像网站。若欲造访原始页面，请点击<a onclick="window.open('https://550w.szyd.fun','_blank');" win12_title="https://550w.szyd.fun" class="jump">这里</a>。</p>
				</div>
			</div>
			<div class="cnt update update-web">
				<h1 class="tit" data-i18n="about.update.name"><span></span>更新记录</h1>
				<div style="margin-left: 20px;">
					<details><summary><span>v1.0.0</span> 更名为 550WOS</summary><p>
						&emsp;&emsp;-项目更名为 550WOS，微软相关品牌统一改为 UEG<br>
						&emsp;&emsp;-内置 AI 助手更名为 MOSS<br>
						&emsp;&emsp;-开发者署名调整为 ShiZhongyan<br>
						&emsp;&emsp;-开源仓库地址更新为 https://github.com/SZYInnovationStudio/550WOS
					</p></details>
					<!-- 全部列出来那这个更多意义何在？ -->
					<a onclick="window.open('changelog.md','_blank');" win12_title="changelog.md" class="a jump" style="text-align: center;">更多</a>
				</div>
			</div>
			<div class="cnt about about-tauri">
				<h1 class="tit"><span></span>550WOS</h1>
				<div style="margin-left: 20px;">
					<h2 class="tit"><span></span>简介</h2>
					<p>&emsp;&emsp;550WOS-desktop 是 550WOS 的桌面应用版本，基于 Tauri 构建，支持 550WOS、macOS 和 Linux。</p>
					<p>&emsp;&emsp;作者：ShiZhongyan，<a class="jump" win12_title="https://github.com/ShiZhongyanGH" onclick="window.open('https://github.com/ShiZhongyanGH','_blank')">GitHub</a>。</p>
					<p>&emsp;&emsp;本项目基于 Windows12（win12-online/win12）修改而来。</p>
					<p>&emsp;&emsp;此项目已发布至 GitHub，<a onclick="window.open('https://github.com/SZYInnovationStudio/550WOS','_blank');" win12_title="https://github.com/SZYInnovationStudio/550WOS" class="jump">点击此处查看</a>。</p>
					<p>&emsp;&emsp;若您对于桌面版有任何意见或建议，请在 GitHub 上<a onclick="window.open('https://github.com/SZYInnovationStudio/550WOS/issues','_blank');" win12_title="https://github.com/SZYInnovationStudio/550WOS/issues" class="jump">提交 issues</a>，您的问题会被尽可能快地解决。</p>
					<h2 class="tit"><span></span>开源说明</h2>
					<p>&emsp;&emsp;此项目是一个开源项目。请在遵守项目许可证的前提下使用、传播、分发、修改以及二次发布。</p>
					<p>&emsp;&emsp;您必须给出源码来源，<strong>包括作者，项目链接等</strong>，并按许可证要求开源。</p>
					<h2 class="tit"><span></span>贡献者</h2>
					<p>&emsp;&emsp;感谢 550WOS-desktop 项目的贡献者（实时数据，计算方法：即为 Commits 次数）</p>
					<div id="contri-desktop">
						<loading>
							<svg width="30px" height="30px" viewBox="0 0 16 16">
								<circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;">
								</circle>
								<circle cx="8px" cy="8px" r="7px" style="stroke:#707070;stroke-width:3px;"></circle>
							</svg>
						</loading>
					</div>
					<h2 class="tit"><span></span>Star</h2>
					<p>&emsp;&emsp;感谢<a class="jump" win12_title="给个 Star 好不好？(即将跳转到：https://github.com/SZYInnovationStudio/550WOS/stargazers)" onclick="window.open('https://github.com/SZYInnovationStudio/550WOS/stargazers','_blank')">所有支持桌面版的人</a>。</p>
					<div id="StarShowDesktop">
						<loading>
							<svg width="30px" height="30px" viewBox="0 0 16 16">
								<circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;">
								</circle>
								<circle cx="8px" cy="8px" r="7px" style="stroke:#707070;stroke-width:3px;"></circle>
							</svg>
						</loading>
					</div>
					<h2 class="tit"><span></span>其它</h2>
					<p>&emsp;&emsp;此项目基于目前 550WOS 版本创造，与 UEG 的 550WOS 正式版本不一致。</p>
					<p>&emsp;&emsp;本项目由 UEG 联合政府打造。</p>
				</div>
			</div>
			<div class="cnt update update-tauri">
				<h1 class="tit"><span></span>更新记录</h1>
				<div id="ReleaseShowDesktop" style="margin-left: 20px;">
					<loading>
						<svg width="30px" height="30px" viewBox="0 0 16 16">
							<circle cx="8px" cy="8px" r="7px" style="stroke:#7f7f7f50;fill:none;stroke-width:3px;">
							</circle>
							<circle cx="8px" cy="8px" r="7px" style="stroke:#707070;stroke-width:3px;"></circle>
						</svg>
					</loading>
					<a onclick="window.open('https://github.com/SZYInnovationStudio/550WOS','_blank');" win12_title="https://github.com/SZYInnovationStudio/550WOS" class="a jump" style="text-align: center;">更多</a>
				</div>
			</div>
		</div>
	</div>
	<div class="window notepad" onclick="if(font_window){playWindowsBackground();showwin('notepad-fonts');}">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/notepad.svg" class="icon">
			<p data-i18n="notepad.name">记事本</p>
			<div>
				<a class="a wbtg red" onclick="apps.notepad.close()"><i
						class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('notepad')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('notepad')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/notepad.svg" class="icon">
		</div>
		<div class="content" id="win-notepad">
			<div class="tool">
				<a class="a" onmouseover="showdp(this,'notepad.file',null)" onmouseleave="hidedp()" data-i18n="notepad.file">文件</a>
				<a class="a" onmouseover="showdp(this,'notepad.edit',null)" onmouseleave="hidedp()" data-i18n="notepad.edit">编辑</a>
				<a class="a" onmouseover="showdp(this,'notepad.view',null)" onmouseleave="hidedp()" data-i18n="notepad.format">格式</a>
				<a class="a notepad-md-toggle" id="notepad-md-toggle" onclick="apps.notepad.togglePreview()" style="display:none;"><i class="bi bi-eye"></i> 预览</a>
			</div>
			<div class="text-box" contenteditable="true" spellcheck="false">
				<p>在此输入...</p>
			</div>
			<div class="md-preview" id="notepad-md-preview" style="display:none;"></div>
			<a href="" download="未命名.html" style="opacity: 0;" class="save">另存为</a>
		</div>
	</div>
	<!-- 这个东西还有用吗？？（ -->
	<div class="window notepad-fonts">
		<div class="titbar">
			<img src="icon/notepad.svg" class="icon">
			<p>字体</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('notepad-fonts', 'configs');font_window=false;"><i class="bi bi-x-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/notepad.svg" class="icon">
		</div>
		<div class="content" id="win-notepad-font">
			<div class="row">
				<div class="select-input" id="win-notepad-font-type">
					<div class="description">字体</div>
					<input type="text" />
					<list class="value-box">
						<a class="option">Arial</a>
						<a class="option">Book Antiqua</a>
						<a class="option">Cascadia Code</a>
						<a class="option">Comic Sans MS</a>
						<a class="option">Consolas</a>
						<a class="option">Courier</a>
						<a class="option">cursive</a>
						<a class="option">Geneva</a>
						<a class="option">Georgia</a>
						<a class="option">Ink Free</a>
						<a class="option">Lucida Console</a>
						<a class="option">Microsoft YaHei UI</a>
						<a class="option">Monaco</a>
						<a class="option">monospace</a>
						<a class="option">Palatino Linotype</a>
						<a class="option">serif</a>
						<a class="option">Tahoma</a>
						<a class="option">仿宋</a>
						<a class="option">方正舒体</a>
						<a class="option">华文行楷</a>
						<a class="option">楷体</a>
						<a class="option">宋体</a>
						<a class="option">幼圆</a>
					</list>
				</div>
				<div class="select-input" id="win-notepad-font-size">
					<div class="description">大小</div>
					<input type="text" />
					<list class="value-box">
						<a class="option">初号</a>
						<a class="option">小初</a>
						<a class="option">一号</a>
						<a class="option">小一</a>
						<a class="option">二号</a>
						<a class="option">小二</a>
						<a class="option">三号</a>
						<a class="option">小三</a>
						<a class="option">四号</a>
						<a class="option">小四</a>
						<a class="option">五号</a>
						<a class="option">小五</a>
					</list>
				</div>
				<div class="select-input" id="win-notepad-font-style">
					<div class="description">字形</div>
					<input type="text" />
					<list class="value-box">
						<a class="option">正常</a>
						<a class="option">斜体</a>
						<a class="option">粗体</a>
						<a class="option">粗偏斜体</a>
					</list>
				</div>
			</div>
			<div class="preview">
				<div class="description">
					预览
				</div>
				<div class="preview-box">
					<div>Hello</div>
					<div>你好</div>
					<div>こんにちは</div>
				</div>
			</div>
			<div class="buttons">
				<a class="a submit act" onclick="apps.notepadFonts.commitFont();" data-i18n="ok">确定</a>
				<a class="a cancel act" onclick="hidewin('notepad-fonts', 'configs');font_window=false;" data-i18n="cancel">取消</a>
			</div>
		</div>
	</div>
	<div class="window terminal terminal-apps">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/terminal.svg" class="icon">
			<p data-i18n="terminal.name">终端</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('terminal')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('terminal')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('terminal')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/terminal.svg" class="icon">
		</div>

		<div class="content" id="win-terminal" onmouseup="$('#win-terminal input').focus();" ontouchend="$('#win-terminal input').focus();">
            <pre>
				UEG 550WOS [版本 12.0.39035.7324]
				(c) UEG 联合政府。保留所有权利。
			</pre>
			<pre class="text-cmd"></pre>
			<pre
				style="display: flex"><span class="prompt">C:\\550W\\System32> </span><input type="text" onkeyup="if (event.keyCode == 13) { apps.terminal.run(); }"></pre>
		</div>
	</div>
	<div class="window python terminal-apps">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/python.svg" class="icon">
			<p>Python 3.11.2</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('python')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('python')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('python')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/python.svg" class="icon">
		</div>

		<div class="content" id="win-python" onmouseup="$('#win-python input').focus();" ontouchend="$('#win-python input').focus();">
            <pre>
				Python 3.11.2  [MSC v.1912 64 bit (AMD64)] :: Anaconda, Inc. on win32
				Type "help", "copyright", "credits" or "license" for more information.
			</pre>
			<pre class="text-cmd"></pre>
			<pre>>>> <input type="text" onkeyup="if (event.keyCode == 13) { apps.python.run(); }"></pre>
		</div>
	</div>
	<div class="window edge tabs" onmousemove="if(apps.edge.in_div('over-bar',event)||apps.edge.in_div('edge-path-bar',event)||apps.edge.in_div('edge-titbar',event)){null}else{if(apps.edge.fuls){$('.edge>.titbar').hide();$('.edge>.content>.tool').hide()}}">
		<div class="resize-bar"></div>
		<div style="height:3px;width:100%;display: none;" id="over-bar" onmouseover="if(apps.edge.fuls){$('.edge>.titbar').show();$('.edge>.content>.tool').show()}" onmouseleave="if(apps.edge.fuls&&(apps.edge.b1||apps.edge.b2)){$('.edge>.titbar').hide();$('.edge>.content>.tool').hide()}"></div>
		<div class="titbar" onmouseleave="apps.edge.b1=false;" onmouseover="apps.edge.b1=true;" id="edge-titbar">
			<img src="icon/edge.svg" class="icon">
			<p style="display: none;">UEG Edge</p>
			<div class="tabs">
			</div>
			<div>
				<a class="a wbtg red" onclick="hidewin('edge')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('edge');apps.edge.max=!apps.edge.max;" id="edge-max"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="apps.edge.exitfullscreen()" id="fuls-edge-exit" style="display: none;"><i class="bi bi-arrows-angle-contract" id="fuls-edge-i"></i></a>
				<a class="a wbtg" onclick="minwin('edge')"><i class="bi bi-dash-lg"></i></a>
				<a class="a wbtg" onclick="apps.edge.fullscreen()" id="fuls-edge"><i class="bi bi-arrows-angle-expand" id="fuls-edge-i"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/edge.svg" class="icon">
		</div>
		<div class="content" id="win-edge">
			<div class="tool" onmouseleave="apps.edge.b2=false;" onmouseover="apps.edge.b2=true;" id="edge-path-bar">
				<a class="a back" onclick="apps.edge.back(apps.edge.tabs[apps.edge.now][0]);">
					<i class="bi bi-arrow-left-short" style="font-size: 25px;--top:-5px;"></i>
				</a>
				<a class="a front" onclick="apps.edge.front(apps.edge.tabs[apps.edge.now][0]);">
					<i class="bi bi-arrow-right-short" style="font-size: 25px;--top:-5px;"></i>
				</a>
				<a class="a" onclick="apps.edge.reload()">
					<i class="bi bi-arrow-clockwise"></i>
				</a>
				<input type="text" onpointerdown="this.select();" onkeyup="if(event.keyCode==13&&$(this).val().trim()!=''){apps.edge.goto($(this).val().trim())}"
					placeholder="在 UEG 搜索中搜索，或输入一个网址" class="url" spellcheck="false" id="edge-path" data-i18n-attr="placeholder" data-i18n-key="edge.schbing">
				<input type="text" onkeyup="if(event.keyCode==13&&$(this).val().trim()!=''){m_tab.rename('edge',$(this).val().trim());}"
					placeholder="为标签页命名" class="rename" spellcheck="false"  data-i18n-attr="placeholder" data-i18n-key="edge.rename">
				<a class="a">
					<i class="bi bi-info-circle" win12_title="浏览器只能访问允许嵌套的网站。由于规则限制无法获取网页标题，请右键标签页手动命名"></i>
				</a>
				<a class="a" style="filter: contrast(0.2);" onclick="add_save()">
					<i class="bi bi-star"></i>
				</a>
				<a class="a" style="filter: contrast(0.2);">
					<i class="bi bi-code-slash"></i>
				</a>
		    </div>
			<div id="save-bar" style="margin:10px;margin-top: 3px;white-space: nowrap;overflow-x: scroll;">
				<!--收藏夹-->
				<a onclick="apps.edge.goto('https://github.com/SZYInnovationStudio/550WOS')" win12_title="https://github.com/SZYInnovationStudio/550WOS" class="save-item"><i class="bi bi-file-earmark"></i>550WOS</a>
				<a onclick="apps.edge.goto('https://www.bing.com')" win12_title="https://www.bing.com" class="save-item"><i class="bi bi-file-earmark"></i>UEG 搜索</a>
				<style>
					#save-bar{
						scrollbar-width: none; /* Firefox */
						-ms-overflow-style: none; /* IE 10+ */
					}
					#save-bar::-webkit-scrollbar {
					  display: none; /* Chrome Safari */
					}
				</style>
			</div>
			<iframe frameborder="0" class="0 show" onmousemove="if(apps.edge.fuls){$('.edge>.titbar').hide();$('.edge>.content>.tool').hide()}">
			</iframe>
		</div>
	</div>
	<div class="msg update" oncontextmenu="return showcm(event,'msgupdate',null)">
		<div class="main" onclick="openapp('about');if($('.window.about').hasClass('min'))minwin('about');
			apps.about.page('update');
			$('#win-about>.update.show>div>details:first-child').attr('open','open')">
			<p class="tit"></p>
			<p class="cont"></p>
		</div>
		<div class="a hide" onclick="$('.msg').removeClass('show')"><i class="bi bi-arrow-right-short"></i></div>
	</div>
	<div class="window vscode webapp">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/vscode.png" class="icon">
			<p>Visual Studio Code</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('vscode')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('vscode')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('vscode')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/vscode.png" class="icon">
		</div>
		<div class="content" id="win-vscode">
			<!-- <iframe src="https://github1s.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe> -->
		</div>
	</div>
	<div class="window bilibili webapp">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/bilibili.png" class="icon">
			<p data-i18n="bilibili.name">哔哩哔哩</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('bilibili')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('bilibili')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('bilibili')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/bilibili.png" class="icon">
		</div>
		<div class="content" id="win-bilibili">
			<!-- <iframe src="https://bilibili.com/" frameborder="0" style="width: 100%; height: 100%;" loading="lazy"></iframe> -->
		</div>
	</div>
	<div class="window macos webapp">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/macos.svg" class="icon">
			<p>MacOS</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('macos')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('macos')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('macos')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/macos.svg" class="icon">
		</div>
		<div class="content" id="win-macos"></div>
	</div>
	
	<div class="window copilot">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/copilot.svg" class="icon">
			<p>MOSS</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('copilot')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('copilot')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('copilot')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/copilot.svg" class="icon">
		</div>
		<div class="content" id="win-copilot">
		</div>
	</div>
	<div class="window minesweeper">
      <div class="resize-bar"></div>
        <div class="titbar">
	      <img src="icon/minesweeper.svg" class="icon">
						<p>扫雷</p>
				 <div>
					<a class="a wbtg red" onclick="hidewin('minesweeper')"><i class="bi bi-x-lg"></i></a>
					 <a class="a wbtg max" onclick="maxwin('minesweeper')"><i class="bi bi-app"></i></a>
			        <a class="a wbtg" onclick="minwin('minesweeper')"><i class="bi bi-dash-lg"></i></a>
				</div>
		            </div>
					       <div class="loadback">
		         <img src="icon/minesweeper.svg" class="icon">
													
					</div>
		        <div class="content" id="win-minesweeper">																														                </div>
		    </div>
	<div class="window wsa">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/wsa.png" class="icon">
			<p data-i18n="wsa.name">手机连接 (适用于 Android™️ 的 550WOS 子系统)</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('wsa')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" style="pointer-events: none;color: #777;"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('wsa')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/wsa.png" class="icon">
		</div>
		<div class="content" id="win-wsa" style="margin-bottom:auto;">
			<iframe src="https://android11react.osrc.com/" frameborder="0" style=" width: 100%;height: 100%;" loading="lazy"></iframe>
		</div>
	</div>
	<div class="window pythonEditor">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/pythonEditor.svg" class="icon">
			<p>Python Editor</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('pythonEditor')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('pythonEditor')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('pythonEditor')"><i class="bi bi-dash-lg"></i></a>
				<a class="a wbtg run" onclick="apps.pythonEditor.run();"><i class="bi bi-play"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/pythonEditor.svg" class="icon">
		</div>
		<div class="content" id="win-pythonEditor">
			<div id="win-python-ace-editor"></div>
			<div class="output" id="output"></div>
		</div>
	</div>
	<div class="window camera">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/camera.svg" class="icon">
			<p data-i18n="camera.name">相机</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('camera')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('camera')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('camera')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/camera.svg" class="icon">
		</div>
		<div class="content" id="win-camera">
			<div class="video">
				<video></video>
			</div>
			<div class="control">
				<div>
					<div class="startbutton act" onclick="apps.camera.takePhoto();"></div>
				</div>
			</div>
			<canvas style="display: none;"></canvas>
			<a style="display: none;"></a>
			<div class="error">
				<div class="icon"></div>
				<p><strong>嗯...无法连接到摄像头</strong></p>
				<p>请检查摄像头是否已正确连接，以及是否为本页面授权了摄像头访问</p>
				<a class="a act" onclick="apps.camera.init()">重试</a>
			</div>
		</div>
	</div>
	<div class="window windows12">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/logo.svg" class="icon">
			<p>550WOS</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('windows12')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('windows12')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('windows12')"><i class="bi bi-dash-lg"></i></a>
				<a class="a wbtg" onclick="apps.windows12.init()"><i class="bi bi-arrow-counterclockwise"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/logo.svg" class="icon">
		</div>
		<div class="content" id="win-win12">
			<iframe style="height:100%; width:100%;object-fit:cover;" id="win12-window" frameborder="no"></iframe>
		</div>
	</div>
	<div class="window camera-notice">
		<div class="titbar">
			<img src="icon/camera.svg" class="icon">
			<p data-i18n="camera.notice">提示</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('camera-notice');hidewin('camera')"><i
						class="bi bi-x-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/camera.svg" class="icon">
		</div>
		<div class="content" id="win-camera-notice" style="padding: 0px 10px 0px 10px;">
			<div style="display: flex; width: 100%; justify-content: center; margin-top: 10px; margin-bottom: 10px;">
				<div
					style="width: 50px; height: 50px; background-image: url('icon/camera.svg'); background-repeat: no-repeat;">
				</div>
			</div>
			<p data-i18n="camera.notice.txt">
				&emsp;&emsp;欢迎使用“相机”应用！本应用由 User782Tec 开发，tjy-gitnub 维护。<br />
				&emsp;&emsp;在使用中，本应用将会获取访问您摄像头的权限（用于进行拍摄照片等操作）。本应用不会收集、上传或分享您的任何个人信息与拍摄内容，所有照片仅保存在您设备本地。<br />
				&emsp;&emsp;若您不同意上述协议，将无法使用本应用。
			</p>
			<div class="buttons">
				<a class="a submit act"
					onclick="hidewin('camera-notice', 'configs');localStorage.setItem('camera', true);openapp('camera');" data-i18n="camera.notice.agree">同意并继续</a>
				<a class="a cancel act" onclick="hidewin('camera-notice')" data-i18n="camera.notice.disag">不同意</a>
			</div>
		</div>
	</div>
	<div class="window run">
		<div class="titbar">
		</div>
		<div class="content" id="win-run">
			<div class="open">
				<div class="icon"></div>
				<input class="input" type="text"
					onkeyup="if (event.keyCode == 13) { hidewin('run');apps.run.run($('#win-run>.open>input').val()); }">
				<a class="a button" onclick="hidewin('run');apps.run.run($('#win-run>.open>input').val())" data-i18n="ok">运行</a>
			</div>
		</div>
	</div>
	<div class="window whiteboard">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/whiteboard.svg" class="icon">
			<p>Blackboard</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('whiteboard')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('whiteboard')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('whiteboard')"><i class="bi bi-dash-lg"></i></a>
				<a class="a wbtg" onclick="apps.whiteboard.saveAs()" win12_title="另存为"><i class="bi bi-save"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/whiteboard.svg" class="icon">
		</div>
		<div class="content" id="win-whiteboard">
			<a class="download" href="" download="Picture.png"></a>
			<canvas onmousedown="apps.whiteboard.draw(event);" ontouchstart="apps.whiteboard.draw(event);"></canvas>
			<div class="toolbar">
				<div class="tools">
					<div class="pen1 active" onclick="apps.whiteboard.changePen.call(this)" data-color="#e0e0e0">
						<svg xmlns="https://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 760 950"
							color="#636363">
							<path
								d="M120 881c0-155 96-575 144-630 7-9 25-48 40-88 31-82 50-104 71-82 14 15 81 162 120 264 51 136 105 412 105 542v63h-30c-30 0-30-1-30-55v-55H180v55c0 54 0 55-30 55h-30v-69zm343-98l107-6v-44c0-84-95-447-122-464-15-10-148-12-172-3-27 10-114 328-123 452l-6 72h105c58 0 153-3 211-7zm-89-588c-4-8-10-15-15-15s-9 7-9 15 7 15 15 15c9 0 12-6 9-15z"
								fill="#020202"></path>
							<path fill="#808080"
								d="M150 880v-70h420v140H150v-70zM305 213c10-42 47-123 55-123 9 0 60 112 60 134 0 13-11 16-61 16h-61l7-27z">
							</path>
						</svg>
					</div>
					<div class="pen2" onclick="apps.whiteboard.changePen.call(this)" data-color="#c0c0c0">
						<svg xmlns="https://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 760 950"
							color="#636363">
							<path
								d="M120 881c0-155 96-575 144-630 7-9 25-48 40-88 31-82 50-104 71-82 14 15 81 162 120 264 51 136 105 412 105 542v63h-30c-30 0-30-1-30-55v-55H180v55c0 54 0 55-30 55h-30v-69zm343-98l107-6v-44c0-84-95-447-122-464-15-10-148-12-172-3-27 10-114 328-123 452l-6 72h105c58 0 153-3 211-7zm-89-588c-4-8-10-15-15-15s-9 7-9 15 7 15 15 15c9 0 12-6 9-15z"
								fill="#020202"></path>
							<path fill="#b0b0b0"
								d="M150 880v-70h420v140H150v-70zM305 213c10-42 47-123 55-123 9 0 60 112 60 134 0 13-11 16-61 16h-61l7-27z">
							</path>
						</svg>
					</div>
					<div class="pen3" onclick="apps.whiteboard.changePen.call(this)" data-color="#a0a0a0">
						<svg xmlns="https://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 760 950"
							color="#636363">
							<path
								d="M120 881c0-155 96-575 144-630 7-9 25-48 40-88 31-82 50-104 71-82 14 15 81 162 120 264 51 136 105 412 105 542v63h-30c-30 0-30-1-30-55v-55H180v55c0 54 0 55-30 55h-30v-69zm343-98l107-6v-44c0-84-95-447-122-464-15-10-148-12-172-3-27 10-114 328-123 452l-6 72h105c58 0 153-3 211-7zm-89-588c-4-8-10-15-15-15s-9 7-9 15 7 15 15 15c9 0 12-6 9-15z"
								fill="#020202"></path>
							<path fill="#e6e6e6"
								d="M150 880v-70h420v140H150v-70zM305 213c10-42 47-123 55-123 9 0 60 112 60 134 0 13-11 16-61 16h-61l7-27z">
							</path>
						</svg>
					</div>
					<div class="pen4" onclick="apps.whiteboard.changePen.call(this)" data-color="#808080">
						<svg xmlns="https://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 760 950"
							color="#636363">
							<path
								d="M120 881c0-155 96-575 144-630 7-9 25-48 40-88 31-82 50-104 71-82 14 15 81 162 120 264 51 136 105 412 105 542v63h-30c-30 0-30-1-30-55v-55H180v55c0 54 0 55-30 55h-30v-69zm343-98l107-6v-44c0-84-95-447-122-464-15-10-148-12-172-3-27 10-114 328-123 452l-6 72h105c58 0 153-3 211-7zm-89-588c-4-8-10-15-15-15s-9 7-9 15 7 15 15 15c9 0 12-6 9-15z"
								fill="#020202"></path>
							<path fill="#9e9e9e"
								d="M150 880v-70h420v140H150v-70zM305 213c10-42 47-123 55-123 9 0 60 112 60 134 0 13-11 16-61 16h-61l7-27z">
							</path>
						</svg>
					</div>
					<div class="pen5" onclick="apps.whiteboard.changePen.call(this)" data-color="#606060">
						<svg xmlns="https://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 760 950"
							color="#636363">
							<path
								d="M120 881c0-155 96-575 144-630 7-9 25-48 40-88 31-82 50-104 71-82 14 15 81 162 120 264 51 136 105 412 105 542v63h-30c-30 0-30-1-30-55v-55H180v55c0 54 0 55-30 55h-30v-69zm343-98l107-6v-44c0-84-95-447-122-464-15-10-148-12-172-3-27 10-114 328-123 452l-6 72h105c58 0 153-3 211-7zm-89-588c-4-8-10-15-15-15s-9 7-9 15 7 15 15 15c9 0 12-6 9-15z"
								fill="#020202"></path>
							<path fill="#2b2b2b"
								d="M150 880v-70h420v140H150v-70zM305 213c10-42 47-123 55-123 9 0 60 112 60 134 0 13-11 16-61 16h-61l7-27z">
							</path>
						</svg>
					</div>
					<div class="pen6" onclick="apps.whiteboard.changePen.call(this)" data-color="#404040">
						<svg xmlns="https://www.w3.org/2000/svg" width="76" height="75" viewBox="0 0 760 950"
							color="#636363">
							<path
								d="M120 881c0-155 96-575 144-630 7-9 25-48 40-88 31-82 50-104 71-82 14 15 81 162 120 264 51 136 105 412 105 542v63h-30c-30 0-30-1-30-55v-55H180v55c0 54 0 55-30 55h-30v-69zm343-98l107-6v-44c0-84-95-447-122-464-15-10-148-12-172-3-27 10-114 328-123 452l-6 72h105c58 0 153-3 211-7zm-89-588c-4-8-10-15-15-15s-9 7-9 15 7 15 15 15c9 0 12-6 9-15z"
								fill="#020202"></path>
							<path fill="#808080"
								d="M150 880v-70h420v140H150v-70zM305 213c10-42 47-123 55-123 9 0 60 112 60 134 0 13-11 16-61 16h-61l7-27z">
							</path>
						</svg>
					</div>
					<div class="eraser" onclick="apps.whiteboard.changePen.call(this)" data-color="eraser">
						<img src="apps/icons/whiteboard/marker.png" height="70">
					</div>
					<div class="delete" onclick="apps.whiteboard.delete()">
						<img src="apps/icons/whiteboard/delete.png" height="60">
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="window winver">
		<div class="titbar">
			<p data-i18n="winver.name">关于 550WOS</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('winver');"><i class="bi bi-x-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
		</div>
		<div class="content" id="win-winver">
			<div class="logo">
				<img src="logo_550w.svg" alt="550WOS" />
			</div>
			<hr>
			<p>UEG 550WOS</p>
			<p data-i18n="winver.p1">版本 25H2 (OS 内部版本 24612.1896)</p>
			<p data-i18n="winver.p2">© UEG 联合政府。保留所有权利。</p>
			<p style="margin-top: 20px" data-i18n="winver.p3">550WOS 专业版操作系统及其用户界面受美国和其他国家/地区的商标法和其他待颁布或已颁布的知识产权法保护。</p>
			<div class="bottom">
				<p data-i18n="winver.p4">根据 UEG 软件许可条款，许可如下用户使用本产品</p>
				<p style="margin:20px 0 0 90px">Hengyu Tu</p>
			</div>
			<p ondblclick="$(this).hide()" class="a mesg" data-i18n="winver.p5">上面都是胡扯，切勿当真 (双击隐藏此消息)</p>
			<div class="buttons">
				<a class="a submit act" onclick="hidewin('winver');" data-i18n="ok">确定</a>
			</div>
		</div>
	</div>
	<div class="window code-editor">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/vscode.png" class="icon">
			<p data-i18n="code-editor.name">代码编辑器</p>
			<div>
				<a class="a wbtg red" onclick="apps.codeEditor.close()"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('code-editor')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('code-editor')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/vscode.png" class="icon">
		</div>
		<div class="content" id="win-code-editor">
			<div class="code-toolbar">
				<div class="code-toolbar-left">
					<a class="a code-tb-btn" onclick="apps.codeEditor.save()" title="保存 Ctrl+S"><i class="bi bi-floppy"></i></a>
					<span class="code-tb-sep"></span>
					<a class="a code-tb-btn" onclick="apps.codeEditor.editor?.undo()" title="撤销 Ctrl+Z"><i class="bi bi-arrow-counterclockwise"></i></a>
					<a class="a code-tb-btn" onclick="apps.codeEditor.editor?.redo()" title="重做 Ctrl+Y"><i class="bi bi-arrow-clockwise"></i></a>
					<span class="code-tb-sep"></span>
					<a class="a code-tb-btn" onclick="apps.codeEditor.editor?.execCommand('find')" title="查找 Ctrl+F"><i class="bi bi-search"></i></a>
					<a class="a code-tb-btn" onclick="apps.codeEditor.editor?.execCommand('replace')" title="替换 Ctrl+H"><i class="bi bi-arrow-left-right"></i></a>
					<span class="code-tb-sep"></span>
					<a class="a code-tb-btn" id="code-wrap-btn" onclick="apps.codeEditor.toggleWrap()" title="自动换行"><i class="bi bi-text-wrap"></i></a>
					<a class="a code-tb-btn" onclick="apps.codeEditor.changeFontSize(1)" title="放大字体"><i class="bi bi-zoom-in"></i></a>
					<a class="a code-tb-btn" onclick="apps.codeEditor.changeFontSize(-1)" title="缩小字体"><i class="bi bi-zoom-out"></i></a>
				</div>
				<div class="code-toolbar-right">
					<select id="code-theme-select" onchange="apps.codeEditor.setTheme(this.value)" title="主题">
						<option value="ace/theme/vibrant_ink">Vibrant Ink</option>
						<option value="ace/theme/monokai">Monokai</option>
						<option value="ace/theme/github">GitHub Light</option>
						<option value="ace/theme/twilight">Twilight</option>
						<option value="ace/theme/tomorrow_night">Tomorrow Night</option>
						<option value="ace/theme/solarized_dark">Solarized Dark</option>
						<option value="ace/theme/one_dark">One Dark</option>
						<option value="ace/theme/dracula">Dracula</option>
					</select>
				</div>
			</div>
			<div id="code-ace-editor"></div>
			<div class="code-statusbar">
				<span id="code-status-cursor">行 1, 列 1</span>
				<span id="code-status-lang">Text</span>
				<span id="code-status-tab">空格：4</span>
				<span id="code-status-encoding">UTF-8</span>
			</div>
		</div>
	</div>
	<div class="window imgviewer">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/files/picture.png" class="icon">
			<p data-i18n="imgviewer.name">图片查看器</p>
			<div>
				<a class="a wbtg red" onclick="apps.imgviewer.close()"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('imgviewer')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('imgviewer')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/files/picture.png" class="icon">
		</div>
		<div class="content" id="win-imgviewer" onwheel="event.preventDefault();event.deltaY<0?apps.imgviewer.zoomIn():apps.imgviewer.zoomOut()">
			<img class="preview-img" src="" alt="">
			<div class="imgviewer-toolbar">
				<a class="a" onclick="apps.imgviewer.zoomIn()" title="放大"><i class="bi bi-zoom-in"></i></a>
				<a class="a" onclick="apps.imgviewer.zoomOut()" title="缩小"><i class="bi bi-zoom-out"></i></a>
				<a class="a" onclick="apps.imgviewer.rotateRight()" title="旋转"><i class="bi bi-arrow-clockwise"></i></a>
				<a class="a" onclick="apps.imgviewer.resetView()" title="重置"><i class="bi bi-arrows-angle-contract"></i></a>
			</div>
		</div>
	</div>
	<div class="window mediaplayer">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/files/vidio.png" class="icon">
			<p data-i18n="mediaplayer.name">媒体播放器</p>
			<div>
				<a class="a wbtg red" onclick="apps.mediaplayer.close()"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('mediaplayer')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('mediaplayer')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/files/vidio.png" class="icon">
		</div>
		<div class="content" id="win-mediaplayer">
			<video id="mediaplayer-video" controls style="display:none;"></video>
			<audio id="mediaplayer-audio" controls style="display:none;"></audio>
		</div>
	</div>
	<div class="window pdfviewer">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/files/pdf.svg" class="icon">
			<p data-i18n="pdfviewer.name">PDF 查看器</p>
			<div>
				<a class="a wbtg red" onclick="apps.pdfviewer.close()"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('pdfviewer')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('pdfviewer')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/files/pdf.svg" class="icon">
		</div>
		<div class="content" id="win-pdfviewer">
			<iframe id="pdfviewer-frame" src="" style="width:100%;height:100%;border:none;"></iframe>
		</div>
	</div>
	<div class="window taskmgr">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/taskmgr.png" class="icon">
			<span style="font-size: 15px;margin-top: 9px;" data-i18n="taskmgr.name">550W 任务管理器</span>
			<div style="flex-grow: 1;display: flex;align-items: center;justify-content: center;">
				<input type="text" class="input" style="width: 75%;" placeholder="键入要搜索的名称" id="tsk-search" oninput="apps.taskmgr.generateProcesses()" value=""></input>
			</div>
			<div>
				<a class="a wbtg red" onclick="hidewin('taskmgr')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('taskmgr')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('taskmgr')"><i class="bi bi-dash-lg"></i></a>
			</div>
		</div>
		<div class="loadback">
			<img src="icon/taskmgr.png" class="icon">
		</div>
		<div class="content" id="win-taskmgr" style="height:100%">
			<div class="menu" style="height:100%; display: flex; flex-direction: column;">
				<a class="fold" onclick="apps.taskmgr.fold()" win12_title="折叠"><i class="bi bi-list"></i></a>
				<list class="focs">
					<a class="processes check" onclick="apps.taskmgr.page('processes')" win12_title="进程"><icon class="t-icon"></icon><p><span data-i18n="taskmgr.processes">进程</span></p></a>
					<a class="performance" onclick="apps.taskmgr.page('performance')" win12_title="性能"><icon class="s-icon"></icon><p><span data-i18n="taskmgr.performance">性能</span></p></a>
					<a class="setting" onclick="apps.taskmgr.page('setting')" style="position: absolute; bottom: 0px;" win12_title="设置"><i class="bi bi-gear"></i><p><span data-i18n="taskmgr.settings">设置</span></p></a>
					<span class="focs" data-type="abs" style="position: absolute;top: -445px; left: 0px;"></span>
				</list>
			</div>
			<div class="main">
				<div class="cnt processes show">
					<div class="tit">
						<p data-i18n="taskmgr.processes.title">进程</p>
						<hr>
					</div>
					<table>
						<thead>
							<tr class="title">
								<th data-i18n="taskmgr.processes.name">进程名称</th>
								<th class="align-right" onclick="apps.taskmgr.changeSort(this.childNodes[0], 'cpu');"><i class="bi bi-chevron-down"></i><div class="value">11.4%</div><span data-i18n="taskmgr.processes.cpu">CPU</span></th>
								<th class="align-right" onclick="apps.taskmgr.changeSort(this.childNodes[0], 'memory');"><i class="bi"></i><div class="value">11.4%</div><span data-i18n="taskmgr.processes.memory">内存</span></th>
								<th class="align-right" onclick="apps.taskmgr.changeSort(this.childNodes[0], 'disk');"><i class="bi"></i><div class="value">11.4%</div><span data-i18n="taskmgr.processes.disk">硬盘</span></th>
								<th class="power" data-i18n="taskmgr.processes.power">电源使用情况</th>
							</tr>
						</thead>
						<tbody class="view">
							<!-- 进程信息 -->
						</tbody>
					</table>
				</div>
				<div class="cnt 404">
					<div class="content" style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; flex-direction: column; text-align: center">
						<p data-i18n="taskmgr.processes.no-results"><b>无筛选结果</b><br />请尝试使用其他名称、发布者或 PID 键入以进行筛选。</p>
						<br />
						<a onclick="$('#tsk-search').val('');apps.taskmgr.generateProcesses()" style="cursor: pointer;color:var(--href);" data-i18n="taskmgr.processes.reset-filter">重置筛选器</a>
					</div>
				</div>
				<div class="cnt performance">
					<div class="tit">
						<p data-i18n="taskmgr.performance.title">性能</p>
						<hr>
					</div>
					<div class="content">
						<div class="select-menu">
							<div onclick="apps.taskmgr.graph('graph-cpu')" class="graph-cpu check">
								<div class="left">
									<svg class="graph-view-cpu" viewBox="0 0 6000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="right">
									<div class="tit">CPU</div>
									<div class="data">
										<div class="value1">11.4%</div>
										<div class="value2">10GHz</div>
									</div>
								</div>
							</div>
							<div onclick="apps.taskmgr.graph('graph-memory');" class="graph-memory">
								<div class="left">
									<svg class="graph-view-memory" viewBox="0 0 6000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="right">
									<div class="tit" data-i18n="taskmgr.performance.memory">内存</div>
									<div class="data">
										<div class="value1">11.4 / 100GB</div>
										<div class="value2">11.4%</div>
									</div>
								</div>
							</div>
							<div onclick="apps.taskmgr.graph('graph-disk');" class="graph-disk">
								<div class="left">
									<svg class="graph-view-disk" viewBox="0 0 6000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="right">
									<div class="tit" data-i18n="taskmgr.performance.disk">磁盘</div>
									<div class="data">
										<div class="tit">SSD</div>
										<div class="value2">1.14%</div>
									</div>
								</div>
							</div>
							<div onclick="apps.taskmgr.graph('graph-wifi');" class="graph-wifi">
								<div class="left">
									<svg class="graph-view-wifi" viewBox="0 0 6000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="right">
									<div class="tit" data-i18n="taskmgr.performance.wifi">Wi-Fi</div>
									<div class="data">
										<div class="tit">WLAN</div>
										<div class="value2"><span data-i18n="taskmgr.performance.wifi-speed">发送：1145 接收：1145 Mbps</span></div>
									</div>
								</div>
							</div>
							<div onclick="apps.taskmgr.graph('graph-gpu');" class="graph-gpu">
								<div class="left">
									<svg class="graph-view-gpu" viewBox="0 0 6000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="right">
									<div class="tit">GPU 0</div>
									<div class="data">
										<div class="tit">NBidia GeForce RTX 4090Ti</div>
										<div class="value2">1%</div>
									</div>
								</div>
							</div>
						</div>
						<div class="performance-graph">
							<div class="graph-cpu show">
								<div class="tit">
									<div class="left-name">CPU</div>
									<div class="right-message">The Wandering Earth (R) NB (R) Quantum Chip 550W @ 8192</div>
								</div>
								<div class="graph-msg top">
									<div class="left">% 利用率</div>
									<div class="right">100%</div>
								</div>
								<div class="graph" win12_title="CPU 活动">
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="graph-msg bottom">
									<div class="left">60 秒</div>
									<div class="right">0</div>
								</div>
								<div class="information">
									<div class="left">
										<div><div class="top">利用率</div><div class="value">11.4%</div></div>
										<div><div class="top">速度</div><div class="value">1024.53 GHz</div></div>
										<div><div class="top">进程</div><div class="value">1145</div></div>
										<div><div class="top">线程</div><div class="value">114514</div></div>
										<div><div class="top">句柄</div><div class="value">114514191918</div></div>
										<div><div class="top">正常运行时间</div><div class="value">0:11:45:14</div></div>
									</div>
									<div class="right">
										<table>
											<tbody>
												<tr><td>基准速度：</td><td>10.0 GHz</td></tr>
												<tr><td>插槽：</td><td>1</td></tr>
												<tr><td>内核：</td><td>32</td></tr>
												<tr><td>逻辑处理器：</td><td>32</td></tr>
												<tr><td>虚拟化：</td><td>已启用</td></tr>
												<tr><td>L1 缓存：</td><td>512 MB</td></tr>
												<tr><td>L2 缓存：</td><td>2.1 GB</td></tr>
												<tr><td>L3 缓存：</td><td>5.5 GB</td></tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div class="graph-memory">
								<div class="tit">
									<div class="left-name">内存</div>
									<div class="right-message">100GB</div>
								</div>
								<div class="graph-msg top">
									<div class="left">内存使用量</div>
									<div class="right">100GB</div>
								</div>
								<div class="graph" win12_title="使用中">
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="graph-msg bottom">
									<div class="left">60 秒</div>
									<div class="right">0</div>
								</div>
								<div class="graph-msg top">
									<div class="left">内存组合</div>
								</div>
								<div class="graph2 minor" style="margin-bottom: 10px; border: 1px #303030 solid; height: 35px !important">
									<div class="chart" style="background-color: #30303022;"></div>
								</div>
								<div class="information">
									<div class="left">
										<div><div class="top">使用中 (已压缩)</div><div class="value">11.4 GB</div></div>
										<div><div class="top">可用</div><div class="value">88.6 GB</div></div>
										<div><div class="top">已提交</div><div class="value">12 / 100 GB</div></div>
										<div><div class="top">已缓存</div><div class="value">5.5 GB</div></div>
										<div><div class="top">分页缓冲池</div><div class="value">1 GB</div></div>
										<div><div class="top">非分页缓冲池</div><div class="value">365 MB</div></div>
									</div>
									<div class="right">
										<table>
											<tbody>
												<tr><td>速度：</td><td>4514MHz</td></tr>
												<tr><td>已使用插槽：</td><td>2 / 2</td></tr>
												<tr><td>外形规格：</td><td>Row of chips</td></tr>
												<tr><td>为硬件保留的内存：</td><td>200MB</td></tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div class="graph-disk">
								<div class="tit">
									<div class="left-name">磁盘 0 (C: D:)</div>
									<div class="right-message">NB++ 3PB</div>
								</div>
								<div class="graph-msg top">
									<div class="left">活动时间</div>
									<div class="right">100%</div>
								</div>
								<div class="graph" win12_title="磁盘处理读取或写入请求的时间百分比">
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="graph-msg bottom">
									<div class="left">60 秒</div>
									<div class="right">0</div>
								</div>
								<div class="graph-msg top">
									<div class="left">磁盘传输速率</div>
									<div class="right">100 MB/秒</div>
								</div>
								<div class="graph2 minor" style="margin-bottom: 10px; height: 70px !important; min-height: 70px !important;">
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg" style="width: 100% !important; height: 100% !important"></svg>
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="information">
									<div class="left">
										<div><div class="top">活动时间</div><div class="value">1.14%</div></div>
										<div><div class="top">平均响应时间</div><div class="value">0.014 毫秒</div></div>
										<div style="border-left: 2px #4b4b4b solid; padding-left: 10px;"><div class="top">读取速度</div><div class="value">14 KB/秒</div></div>
										<div style="border-left: 2px #4b4b4b dotted; padding-left: 10px;"><div class="top">写入速度</div><div class="value">114 KB/秒</div></div>
									</div>
									<div class="right">
										<table>
											<tbody>
												<tr><td>容量：</td><td>3 PB</td></tr>
												<tr><td>已格式化：</td><td>3 PB</td></tr>
												<tr><td>系统磁盘：</td><td>是</td></tr>
												<tr><td>页面文件：</td><td>是</td></tr>
												<tr><td>类型：</td><td>SSD</td></tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div class="graph-wifi">
								<div class="tit">
									<div class="left-name">Wi-Fi</div>
									<div class="right-message">NB Wireless LAN 802.11ac</div>
								</div>
								<div class="graph-msg top">
									<div class="left">吞吐量</div>
									<div class="right">100 Mbps</div>
								</div>
								<div class="graph" win12_title="此网络上的发送和接收活动">
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="graph-msg bottom">
									<div class="left">60 秒</div>
									<div class="right">0</div>
								</div>
								<div class="information">
									<div class="left">
										<div><div class="top">发送</div><div class="value">114 Mbps</div></div>
										<div><div class="top">接收</div><div class="value">114 Mbps</div></div>
									</div>
									<div class="right">
										<table>
											<tbody>
												<tr>
													<td>适配器名称：</td>
													<td>WLAN</td>
												</tr>
												<tr>
													<td>SSID: </td>
													<td>NB Network</td>
												</tr>
												<tr>
													<td>连接类型：</td>
													<td>802.11ac</td>
												</tr>
												<tr>
													<td>IPv4 地址：</td>
													<td>114.514.19.81</td>
												</tr>
												<tr>
													<td>IPv6 地址：</td>
													<td>2CBB::2CBB:2CBB:2CBB:2CBB</td>
												</tr>
												<tr>
													<td>信号强度：</td>
													<td>
														<svg xmlns="http://www.w3.org/2000/svg" viewBox="4.4 4.4 26.2 31.2" width="1.45em" height="1.4em">
															<path d="M 5 25 L 5 35 L 10 35 L 10 25 L 5 25 M 10 20 L 10 35 L 15 35 L 15 20 L 10 20 M 15 15 L 20 15 L 20 35 L 15 35 L 15 15 M 20 10 L 25 10 L 25 35 L 20 35 L 20 10 M 25 5 L 25 35 L 30 35 L 30 5 L 25 5" stroke="#636363" stroke-width="0.6" fill="#63636388"/>
														</svg>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div class="graph-gpu">
								<div class="tit">
									<div class="left-name">GPU</div>
									<div class="right-message">NBidia GeForce RTX 9090Ti</div>
								</div>
								<div class="graphs">
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="usage" style="display: none;" xmlns="http://www.w3.org/2000/svg"></svg>
									<div class="graph1">
										<div class="title-gpu">3D</div>
										<div class="chart">
											<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
											<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
										</div>
									</div>
									<div class="graph2">
										<div class="title-gpu">Copy</div>
										<div class="chart">
											<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
											<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
										</div>
									</div>
									<div class="graph3">
										<div class="title-gpu">Video Decode</div>
										<div class="chart">
											<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
											<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
										</div>
									</div>
									<div class="graph4">
										<div class="title-gpu">Video Processing</div>
										<div class="chart">
											<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
											<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
										</div>
									</div>
								</div>
								<div class="graph-msg top">
									<div class="left">专用 GPU 内存利用率</div>
									<div class="right">16 GB</div>
								</div>
								<div class="graph gpu2-1 minor" style="height: 70px !important; min-height: 70px !important;" win12_title="专用 GPU 内存利用率">
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="graph-msg top">
									<div class="left">共享 GPU 内存利用率</div>
									<div class="right">32 GB</div>
								</div>
								<div class="graph gpu2-2 minor" style="height: 70px !important; min-height: 70px !important; margin-bottom: 10px" win12_title="共享 GPU 内存利用率">
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="chart" xmlns="http://www.w3.org/2000/svg"></svg>
									<svg viewBox="0 0 6000 1000" preserveAspectRatio="none" class="bg" xmlns="http://www.w3.org/2000/svg"></svg>
								</div>
								<div class="information">
									<div class="left">
										<div><div class="top">利用率</div><div class="value">1.1%</div></div>
										<div><div class="top">专用 GPU 内存</div><div class="value">0.1 GB / 2 GB</div></div>
										<div><div class="top">共享 GPU 内存</div><div class="value">1.1 GB / 16 GB</div></div>
										<div><div class="top">GPU 内存</div><div class="value">1.2 / 18 GB</div></div>
									</div>
									<div class="right">
										<table>
											<tbody>
												<tr>
													<td>驱动程序版本：</td>
													<td>11.45.14.19</td>
												</tr>
												<tr>
													<td>驱动程序日期：</td>
													<td>2025 / 1 / 5</td>
												</tr>
												<tr>
													<td>DirectX 版本</td>
													<td>12 (FL 12.1)</td>
												</tr>
												<tr>
													<td>物理位置：</td>
													<td>PCI 总线 0、设备 14、功能 0</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="cnt setting">
					<div class="tit">
						<p data-i18n="taskmgr.settings.title">设置</p>
						<hr>
					</div>
					<div>
						<h3 data-i18n="taskmgr.settings.window-management">窗口管理</h3>
						<input type="checkbox" id="tsk-setting-topmost" name="tsk-setting-topmost" style="height: 15px;width:15px;color:#fff;" onclick="if(checked){topmost[topmost.length]='taskmgr'}else{topmost.splice(topmost.indexOf('taskmgr',1))};hidewin('taskmgr');apps.taskmgr.page('processes');$('#win-taskmgr>.menu>list.focs>a')[0].click();saveDesktop();$('#tsk-search').val('');setTimeout('openapp(\`taskmgr\`);apps.taskmgr.generateProcesses();',300);"/><label for="tsk-setting-topmost" style="font-size: 15px;" data-i18n="taskmgr.settings.stay-on-top">置于顶层</label>
					</div>
					<div>
						<h3 data-i18n="taskmgr.settings.feedback">反馈</h3>
                        <a class="a jump" onclick="shownotice('feedback')" data-i18n="taskmgr.settings.send-feedback">发送反馈</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="window word" data-min-width="800" style="width: max(800px, 70%)">
		<div class="resize-bar"></div>
		<div class="titbar">
			<img src="icon/word.svg" class="icon">
			<p data-i18n="word.name">UEG Word Preview</p>
			<div>
				<a class="a wbtg red" onclick="hidewin('word')"><i class="bi bi-x-lg"></i></a>
				<a class="a wbtg max" onclick="maxwin('word')"><i class="bi bi-app"></i></a>
				<a class="a wbtg" onclick="minwin('word')"><i class="bi bi-dash-lg"></i></a>
				<a class="a wbtg" onclick="window.location.href='bluescreen.html';"><i class="bi bi-person"></i></a>
			</div>
		</div>
		<div class="pages">
		<div class="home show">
			<div class="content" id="win-word">
				<div class="app-left">
					<list class="focs">
						<a class="back" onclick="apps.word.edit()"><i class="bi bi-arrow-left-circle"></i></a>
						<a class="home check"><icon class="office-icon"></icon><span class="t2" data-i18n="home">首页</span></a>
					</list>
				</div>
				<div class="app-main">
					<h3>新建</h3>
					<div class="card-list">
						<div class="card" onclick="apps.word.new()">
							<img border="0" src="img/office-newfile.png">
							<p>空白文档</p>
						</div>
						<div class="card" onclick="apps.word.new()">
							<img border="0" src="img/office-newfile.png">
							<p>空白文档</p>
						</div>
					</div>
					<h3>最近</h3>
					<input type="text" class="input" placeholder="搜索">
					<p>你最近尚未打开任何文档。</p>
				</div>
			</div>
		</div>
		<div class="edit">
			<div class="ribbon">
				<div class="tab">
					<a win12_title="暂未完成" data-descp="hide" onclick="apps.word.home()">文件</a>
					<a>插入</a>
					<span class="tab-selected"></span>
				</div>
				<div class="items">
					<div class="item" onclick="$('.window.word>.pages>.edit>.content>.doc.homepage').append('默认文本<br>')">
						<i class="bi bi-text-paragraph"></i>
						<p>段</p>
					</div>
					<div class="item" onclick="$('.window.word>.pages>.edit>.content>.doc.homepage').append('<h1>默认标题</h1>')">
						<i class="bi bi-text-paragraph"></i>
						<p>主标题</p>
					</div>
					<div class="item" onclick="$(\`.window.word>.pages>.edit>.content>.doc.homepage\`).append(\`<img class='square'>\`)">
						<i class="bi bi-bounding-box"></i>
						<p>方形</p>
					</div>
					<div class="item" onclick="$(\`.window.word>.pages>.edit>.content>.doc.homepage\`).append(\`<table class='table' border='1' contenteditable><tr><th></th><th></th><th></th></tr><tr><th></th><th></th><th></th></tr><tr><th></th><th></th><th></th></tr></table><br>\`)">
						<i class="bi bi-bounding-box"></i>
						<p>表格</p>
					</div>
					<div class="item" onclick='$(\`.window.word>.pages>.edit>.content\`).append(\`<div class="doc" contenteditable></div>\`)'>
						<i class="bi bi-file"></i>
						<p>空白页</p>
					</div>
				</div>
			</div>
			<div class="content">
				<div class="doc homepage" contenteditable></div>
			</div>
		</div>
		</div>
	</div>`;
