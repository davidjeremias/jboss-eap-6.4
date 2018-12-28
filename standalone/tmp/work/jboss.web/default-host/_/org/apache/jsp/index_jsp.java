package org.apache.jsp;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class index_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final JspFactory _jspxFactory = JspFactory.getDefaultFactory();

  private static java.util.List _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public Object getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(HttpServletRequest request, HttpServletResponse response)
        throws java.io.IOException, ServletException {

    PageContext pageContext = null;
    HttpSession session = null;
    ServletContext application = null;
    ServletConfig config = null;
    JspWriter out = null;
    Object page = this;
    JspWriter _jspx_out = null;
    PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html");
      response.addHeader("X-Powered-By", "JSP/2.2");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("<html style=\"height: 100%;\">\r\n");
      out.write("<head>\r\n");
      out.write("<meta charset=\"utf-8\">\r\n");
      out.write("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n");
      out.write("<link rel=\"stylesheet\" href=\"resources/css/bootstrap.min.css\">\r\n");
      out.write("<script src=\"resources/scripts/jquery-1.9.1.js\"></script>\r\n");
      out.write("<script src=\"resources/scripts//bootstrap.min.js\"></script>\r\n");
      out.write("<script src=\"resources/js/keycloak.js\" type=\"text/javascript\"></script>\r\n");
      out.write("\r\n");
      out.write("<script type=\"text/javascript\">\r\n");
      out.write("\tvar kc = Keycloak('http://localhost:8080/resources/keycloak.json');\r\n");
      out.write("\r\n");
      out.write("\tvar loadData = function() {\r\n");
      out.write("\t\tconsole.log(kc);\r\n");
      out.write("\t\tvar data = new Date()\r\n");
      out.write("\t\tdata.setTime(data.getTime() + 600000);\r\n");
      out.write("\t\t\r\n");
      out.write("\t\tvar realm = kc.tokenParsed.preferred_username;\r\n");
      out.write("\t\tfor(var i = 0; i < kc.realmAccess.roles.length; i++){\r\n");
      out.write("\t\trealm +=\"-\"+kc.realmAccess.roles[i];\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tconsole.log(realm);\r\n");
      out.write("\t\tdocument.cookie = \"keycloak=\" + realm + \"; expires=\" + data.toUTCString()+ \"; path=/\";\r\n");
      out.write("\t};\r\n");
      out.write("\r\n");
      out.write("\tvar reloadData = function() {\r\n");
      out.write("\r\n");
      out.write("\t\tkc.updateToken(10).success(loadData).error(function() {\r\n");
      out.write("\t\t\tconsole.log('Failed to load data.  User is logged out.');\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tkc.init({\r\n");
      out.write("\t\tonLoad : 'login-required'\r\n");
      out.write("\t}).success(reloadData).error(\r\n");
      out.write("\t\t\tfunction(errorData) {\r\n");
      out.write("\t\t\t\tconsole.log(\"Failed to load data. Error: \"\r\n");
      out.write("\t\t\t\t\t\t+ JSON.stringify(errorData));\r\n");
      out.write("\t\t\t});\r\n");
      out.write("</script>\r\n");
      out.write("\r\n");
      out.write("</head>\r\n");
      out.write("<body style=\"margin: 0; height: 100%;\">\r\n");
      out.write("\t<iframe id=\"home\" name=\"home\" src=\"pages/home.jsf\"\r\n");
      out.write("\t\tstyle=\"width: 100%; height: 100%; border: none;\"></iframe>\r\n");
      out.write("</body>\r\n");
      out.write("</html>\r\n");
      out.write("\r\n");
    } catch (Throwable t) {
      if (!(t instanceof SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
