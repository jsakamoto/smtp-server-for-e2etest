using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Owin.FileSystems;

namespace Toolbelt.Net.Smtp.Code
{
    public class EmbededResourceFileSystem2 : IFileSystem
    {
        protected readonly EmbeddedResourceFileSystem _fileSystem;

        protected readonly string[] _resourceNames;

        protected readonly string _baseNamespace;

        public EmbededResourceFileSystem2(string baseNamespace)
        {
            _fileSystem = new EmbeddedResourceFileSystem(baseNamespace);
            _baseNamespace = baseNamespace;
            _resourceNames = Assembly.GetCallingAssembly().GetManifestResourceNames();
        }

        public bool TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            if (string.IsNullOrEmpty(subpath) || subpath[0] != '/')
            {
                fileInfo = null;
                return false;
            }

            var fixpath = (_baseNamespace + "." + subpath.Substring(1).Replace('/', '.')).ToLower();
            fixpath = _resourceNames.FirstOrDefault(name => name.ToLower() == fixpath);
            if (fixpath == null)
            {
                fileInfo = null;
                return false;
            }

            fixpath = "/" + fixpath.Substring(_baseNamespace.Length + 1);
            return _fileSystem.TryGetFileInfo(fixpath, out fileInfo);
        }

        public bool TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            throw new NotImplementedException();
        }
    }
}
