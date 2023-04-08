export function toXML(serializer) {
	var costumeIdx = this.getCostumeIdx();

	this.removeAllClones();
	return serializer.format(
		'<stage name="@" width="@" height="@" ' +
			'costume="@" color="@,@,@,@" tempo="@" threadsafe="@" ' +
			'tutorial="@" ' +
			'hideCostumesTab="@" hideSoundsTab="@" hideCorralBar="@" hideFileBtn="@" hideCloudBtn="@" hideControlBtns="@" hideSpriteBar="@" ' +
			'decategorize="@" changeBlocks="@" enableGlide="@" ' +
			'penlog="@" ' +
			"%" +
			'volume="@" ' +
			'pan="@" ' +
			'lines="@" ' +
			'ternary="@" ' +
			'hyperops="@" ' +
			'codify="@" ' +
			'inheritance="@" ' +
			'sublistIDs="@" ~>' +
			"<pentrails>$</pentrails>" +
			"%" + // current costume, if it's not in the wardrobe
			"<costumes>%</costumes>" +
			"<sounds>%</sounds>" +
			"<variables>%</variables>" +
			"<blocks>%</blocks>" +
			"<scripts>%</scripts>" +
			'<sprites select="@">%</sprites>' +
			"</stage>",
		this.name,
		this.dimensions.x,
		this.dimensions.y,
		costumeIdx,
		this.color.r,
		this.color.g,
		this.color.b,
		this.color.a,
		this.getTempo(),
		this.isThreadSafe,
		StageMorph.prototype.tutorial,
		StageMorph.prototype.tutorial ? false : StageMorph.prototype.hideCostumesTab,
		StageMorph.prototype.tutorial ? false : StageMorph.prototype.hideSoundsTab,
		StageMorph.prototype.tutorial ? false : IDE_Morph.prototype.hideCorralBar,
		StageMorph.prototype.tutorial ? false : IDE_Morph.prototype.hideFileBtn,
		StageMorph.prototype.tutorial ? false : IDE_Morph.prototype.hideCloudBtn,
		StageMorph.prototype.tutorial ? false : IDE_Morph.prototype.hideControlBtns,
		StageMorph.prototype.tutorial ? false : IDE_Morph.prototype.hideSpriteBar,
		StageMorph.prototype.tutorial ? false : StageMorph.prototype.decategorize,
		StageMorph.prototype.tutorial ? false : StageMorph.prototype.changeBlocks,
		StageMorph.prototype.enableGlide,
		this.enablePenLogging,
		this.instrument ? ' instrument="' + parseInt(this.instrument) + '" ' : "",
		this.volume,
		this.pan,
		SpriteMorph.prototype.useFlatLineEnds ? "flat" : "round",
		BooleanSlotMorph.prototype.isTernary,
		Process.prototype.enableHyperOps === true,
		this.enableCodeMapping,
		this.enableInheritance,
		this.enableSublistIDs,
		normalizeCanvas(this.trailsCanvas, true).toDataURL("image/png"),

		// current costume, if it's not in the wardrobe
		!costumeIdx && this.costume ? "<wear>" + serializer.store(this.costume) + "</wear>" : "",

		serializer.store(this.costumes, this.name + "_cst"),
		serializer.store(this.sounds, this.name + "_snd"),
		serializer.store(this.variables),
		serializer.store(this.customBlocks),
		serializer.store(this.scripts),
		serializer.root.sprites.asArray().indexOf(serializer.root.currentSprite) + 1,
		serializer.store(this.children)
	);
}

export function trailsLogAsSVG() {
	var bottomLeft = this.trailsLog[0][0],
		topRight = bottomLeft,
		maxWidth = this.trailsLog[0][3],
		shift,
		box,
		p1,
		p2,
		svg;

	// determine bounding box and max line width
	this.trailsLog.forEach((line) => {
		bottomLeft = bottomLeft.min(line[0]);
		bottomLeft = bottomLeft.min(line[1]);
		topRight = topRight.max(line[0]);
		topRight = topRight.max(line[1]);
		maxWidth = Math.max(maxWidth, line[3]);
	});
	box = bottomLeft.corner(topRight).expandBy(maxWidth / 2);
	shift = new Point(-bottomLeft.x, topRight.y).translateBy(maxWidth / 2);
	svg =
		'<svg xmlns="http://www.w3.org/2000/svg" ' +
		'preserveAspectRatio="none" ' +
		'viewBox="0 0 ' +
		box.width() +
		" " +
		box.height() +
		'" ' +
		'width="' +
		box.width() +
		'" height="' +
		box.height() +
		'" ' +
		// 'style="background-color:black" ' + // for supporting backgrounds
		">";
	svg += "<!-- Generated by CSnap Pro! - https://csdt.org/ -->";

	// for debugging the viewBox:
	// svg += '<rect width="100%" height="100%" fill="black"/>'

	this.trailsLog.forEach((line) => {
		p1 = this.normalizePoint(line[0]).translateBy(shift);
		p2 = this.normalizePoint(line[1]).translateBy(shift);
		svg +=
			'<line x1="' +
			p1.x +
			'" y1="' +
			p1.y +
			'" x2="' +
			p2.x +
			'" y2="' +
			p2.y +
			'" ' +
			'style="stroke:' +
			line[2].toRGBstring() +
			";" +
			"stroke-opacity:" +
			line[2].a +
			";" +
			"stroke-width:" +
			line[3] +
			";stroke-linecap:" +
			line[4] +
			'" />';
	});
	svg += "</svg>";
	return {
		src: svg,
		rot: new Point(-box.origin.x, box.corner.y),
	};
}

export function userMenu() {
	var ide = this.parentThatIsA(IDE_Morph),
		menu = new MenuMorph(this);

	if (ide && ide.isAppMode) {
		// menu.addItem('help', 'nop');
		return menu;
	}
	menu.addItem("edit", "edit");
	menu.addItem("show all", "showAll");
	menu.addItem("pic...", () => ide.saveCanvasAs(this.fullImage(), this.name), "save a picture\nof the stage");
	menu.addLine();
	menu.addItem(
		"stl...",
		() => {
			ide.exportAsSTL();
		},
		"save a stl of\nthe stage (High\nContrast Required)"
	);
	menu.addItem(
		"advanced stl...",
		() => {
			ide.launchSTLParamsPrompt(ide.getProjectName());
		},
		"save a stl of\nthe stage (High\nContrast Required)"
	);

	menu.addLine();
	menu.addItem(
		"pen trails",
		() => {
			var costume = ide.currentSprite.reportPenTrailsAsCostume().copy();
			ide.currentSprite.addCostume(costume);
			ide.currentSprite.wearCostume(costume);
			ide.hasChangedMedia = true;
			ide.spriteBar.tabBar.tabTo("costumes");
		},
		ide.currentSprite instanceof SpriteMorph
			? "turn all pen trails and stamps\n" + "into a new costume for the\ncurrently selected sprite"
			: "turn all pen trails and stamps\n" + "into a new background for the stage"
	);
	if (this.trailsLog.length) {
		menu.addItem("svg...", "exportTrailsLogAsSVG", "export pen trails\nline segments as SVG");
	}
	return menu;
}
