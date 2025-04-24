export function Background() {
	return (
		<div className="tw:absolute tw:-z-10 tw:bg-[url('/public/images/stars.png')] tw:h-full tw:w-full tw:opacity-20"></div>
	);
}

export function Dialog({ show, children }) {
	return (
		show && (
			<>
				<div className="tw:bg-gray-600 tw:fixed tw:top-0 tw:left-0 tw:w-full tw:h-screen tw:opacity-50"></div>
				<div className="tw:fixed tw:top-0 tw:left-0 tw:w-full tw:h-screen tw:flex tw:justify-center tw:items-center">
					{children}
				</div>
			</>
		)
	);
}
