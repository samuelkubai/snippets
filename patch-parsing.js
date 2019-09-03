const test = `
@@ -195,3 +195,11 @@ def update(self, instance, validated_data):
         instance.profile.save()
 
         return instance
+
+
+class SocialAuthenticationSerializer(serializers.Serializer):
+    """ Holder for  provider, acces token , and access_token_secret"""
+    access_token = serializers.CharField(max_length=500, required=True)
+    access_token_secret = serializers.CharField(
+        max_length=500, allow_blank=True)
+    provider = serializers.CharField(max_length=500, required=True)
`;

const HeaderRegexp = /@@(.*)@@/g;

class FileInfo {
  constructor(info) {
    const parsedInfo = info.map(i => {
      const fileBoundaries = i.split(',');
      const startingLine = Math.abs(parseInt(fileBoundaries[0]));

      return {
        lastLine: startingLine + parseInt(fileBoundaries[1]),
        startingLine: startingLine,
        type: parseInt(fileBoundaries[0]) > 0 ? '+' : '-',
      };
    });

    this.originalFile = parsedInfo[0];
    this.updatedFile = parsedInfo[1];

    this.calculateOverallInfo();
  }

  calculateOverallInfo() {
    if (this.originalFile.lastLine > this.updatedFile.lastLine) {
      this.overall = {
        ...this.originalFile,
        recomendation: 'deletion',
      };
    } else {
      this.overall = {
        ...this.updatedFile,
        recomendation: 'addition',
      };
    }
  }
}

class PatchParser {
  extractHeader(chunk) {
    return chunk.match(HeaderRegexp)[0];
  }

  extractFileInfo(chunkHeader) {
    const info = new FileInfo(
      chunkHeader
        .replace('@@', '')
        .replace('@@', '')
        .trim()
        .split(' '),
    );

    console.log(info);
  }

  parseChunk(chunk) {
    const header = this.extractHeader(chunk);
    const fileInfoDto = this.extractFileInfo(header);
  }
}

const parser = new PatchParser();
parser.parseChunk(test);
