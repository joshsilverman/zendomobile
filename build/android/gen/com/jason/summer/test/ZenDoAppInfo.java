package com.jason.summer.test;

import org.appcelerator.titanium.ITiAppInfo;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiProperties;
import org.appcelerator.titanium.util.Log;

/* GENERATED CODE
 * Warning - this class was generated from your application's tiapp.xml
 * Any changes you make here will be overwritten
 */
public final class ZenDoAppInfo implements ITiAppInfo
{
	private static final String LCAT = "AppInfo";
	
	public ZenDoAppInfo(TiApplication app) {
		TiProperties properties = app.getSystemProperties();
					
					properties.setString("ti.deploytype", "development");
	}
	
	public String getId() {
		return "com.mobile.reviewer";
	}
	
	public String getName() {
		return "Zen.do";
	}
	
	public String getVersion() {
		return "1.0";
	}
	
	public String getPublisher() {
		return "jasonurton";
	}
	
	public String getUrl() {
		return "http://";
	}
	
	public String getCopyright() {
		return "2011 by jasonurton";
	}
	
	public String getDescription() {
		return "not specified";
	}
	
	public String getIcon() {
		return "appicon.png";
	}
	
	public boolean isAnalyticsEnabled() {
		return true;
	}
	
	public String getGUID() {
		return "7fd77412-22ce-4527-a73c-1a942167f7e2";
	}
	
	public boolean isFullscreen() {
		return false;
	}
	
	public boolean isNavBarHidden() {
		return false;
	}
}
